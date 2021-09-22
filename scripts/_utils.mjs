/* eslint-disable no-tabs */
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { promisify } from 'util'
import fetch from 'node-fetch'
import { JSDOM } from 'jsdom'
import prompt from 'async-prompt'
import pretty from 'pretty'
import chalk from 'chalk'
import { exec as _exec } from 'child_process'

const exec = promisify(_exec)

async function cmd (line, verboseOpt = true) {
  const { stdout, stderr } = await exec(line)
  if (stderr) {
    if (verboseOpt) console.log(stdout)
    throw stderr
  } else if (stdout) {
    if (verboseOpt) console.log(stdout)
    return stdout
  }
}

async function laxcmd (line, verboseOpt = true) {
  try {
    return await cmd(line, verboseOpt)
  } catch (err) {
    if (verboseOpt) console.log(err)
    return err.stdout
  }
}

async function updatePreload () {
  console.log(chalk.bold('\n⏬ Updating spreadsheet preload...\n'))
  const rootDirPath = process.cwd()
  const preloadJsFilePath = join(rootDirPath, 'src/preload.ts')
  const rawConfigJson = readFileSync('src/config.json', { encoding: 'utf8' })
  const config = JSON.parse(rawConfigJson)
  console.log('config.json loaded and parsed')
  console.log('sheetbase url:', config.sheetbase_url)
  if (config.sheetbase_url) {
    const spreadsheetDataResponse = await fetch(config.sheetbase_url)
    const spreadsheetData = await spreadsheetDataResponse.text()
    const replacedPreloadJsContent = `const preload = \`${spreadsheetData}\`\n\nexport default preload\n`
    console.log('preload.ts new contents:\n')
    console.log(chalk.grey(replacedPreloadJsContent))
    console.log(chalk.green('\nUpdated preload.\n'))
    writeFileSync(preloadJsFilePath, replacedPreloadJsContent, { encoding: 'utf8' })
    return replacedPreloadJsContent
  } else {
    console.log('no sheetbase, no preload')
    const replacedPreloadJsContent = 'const preload = `key	name	type`\n\nexport default preload\n'
    console.log('preload.ts new contents:\n')
    console.log(chalk.grey(replacedPreloadJsContent))
    writeFileSync(preloadJsFilePath, replacedPreloadJsContent, { encoding: 'utf8' })
    console.log(chalk.green('\nUpdated preload.\n'))
    return replacedPreloadJsContent
  }
}

async function emptyPreload () {
  console.log(chalk.bold('\n🕳 Emptying spreadsheet preload...\n'))
  const rootDirPath = process.cwd()
  const preloadJsFilePath = join(rootDirPath, 'src/preload.ts')
  const preloadContent = 'const preload = `key	name	type`\n\nexport default preload\n'
  console.log('preload.ts new contents:\n')
  console.log(chalk.grey(replacedPreloadJsContent))
  writeFileSync(preloadJsFilePath, preloadContent, { encoding: 'utf8' })
  console.log(chalk.green('\nUpdated preload.\n'))
  return preloadContent
}

async function lint () {
  console.log(chalk.bold('\n👀 Linting...\n'))
  try {
    await cmd('npm run lint', false)
    console.log(chalk.green('\nLinted.\n'))
  } catch (err) {
    console.log(chalk.red(err.stdout))
    const ok = await confirm('Your code shows lint errors, do you want to continue ? (y/n): ')
    if (!ok) {
      console.log(chalk.bold.red('\nOk, bye.\n'))
      process.exit(1)
    }
  }
}

async function checkGitStatus () {
  console.log(chalk.bold('\n📡 Checking git status...\n'))
  const gitStatus = await cmd('git status', false)
  return gitStatus
}

async function handleGitStatus (gitStatus) {
  const foundLine = gitStatus.split('\n').find(line => line === 'nothing to commit, working tree clean')
  if (foundLine === undefined) {
    console.log(chalk.red(gitStatus))
    const ok = await confirm('You have uncommited changes to your code, do you want to continue ? (y/n): ')
    if (!ok) {
      await cmd('echo "Ok, bye."')
      process.exit(1)
    }
  }
  const gitStatusIsClean = foundLine !== undefined
  return gitStatusIsClean
}

async function copySourceToTemp () {
  console.log(chalk.bold('\n👬 Copying source files to .temp/...\n'))
  await cmd('rm -rf .temp')
  console.log('deleted .temp/')
  await cmd('mkdir .temp')
  console.log('created .temp/')
  await cmd('cp index.html .temp/index.html')
  console.log('copied index.html into .temp/')
  await cmd('cp -r src .temp/src')
  console.log('copied src/ into .temp/')
  await cmd('cp -r static .temp/static')
  console.log('copied static/ into .temp/')
  console.log(chalk.green('\nCopied source files to .temp/\n'))
}

async function stripDevElementsInIndex () {
  console.log(chalk.bold('\n✏️  Stripping dev elements in .temp/index.html...\n'))
  const rootDirPath = process.cwd()
  const tempIndexHtmlFilePath = join(rootDirPath, '.temp/index.html')
  await editHtml(tempIndexHtmlFilePath, $document => {
    $document.querySelector('.lm-app-fake-lm-header').remove()
    console.log('removed div.lm-app-fake-lm-header')
    $document.querySelector('.lm-app-fake-lm-footer').remove()
    console.log('removed div.lm-app-fake-lm-footer')
    const $links = $document.querySelectorAll('link')
    $links.forEach($link => {
      const href = $link.getAttribute('href')
      const isToDelete = href.match(/^\.\/static\.dev/)
      if (isToDelete) {
        console.log(`removed link to ${href}`)
        return $link.remove()
      }
    })
    return $document
  }, false)
  console.log(chalk.green('\nStripped .temp/index.html dev stuff\n'))
}

async function buildFromTemp () {
  console.log(chalk.bold('\n🏗️  Building the app with Vite...\n'))
  await cmd('rm -rf ./build')
  console.log('deleted build/')
  try {
    await cmd('tsc && vite build')
    console.log(chalk.green('\nBuilt app with Vite.\n'))
  } catch (err) {
    console.log(chalk.red(err.trim()))
    const ok = await confirm('\nSome errors occured during build, do you want to continue ? (y/n): ')
    if (!ok) {
      await cmd('rm -rf .temp')
      console.log(chalk.bold.red('\nOk, bye.\n'))
      process.exit(1)
    }
  }
}

async function deleteTemp () {
  console.log(chalk.bold('\n🗑️  Deleting .temp/...\n'))
  await cmd('rm -rf .temp')
  console.log(chalk.green('\nDeleted .temp/\n'))
}

async function getAssetsFilesPath () {
  const rootDirPath = process.cwd()
  const assetsFilesPath = join(rootDirPath, 'build/assets')
  return assetsFilesPath
}

async function listAssetsInBuild () {
  const assetsFilesPath = await getAssetsFilesPath()
  const assetsFilesList = readdirSync(assetsFilesPath)
  return assetsFilesList
}

async function rollupIndexAndVendor () {
  console.log(chalk.bold('\n⚙️  Rollup vendor and index into a single IIFE...\n'))
  const assetsFilesList = await listAssetsInBuild()
  const assetsFilesPath = await getAssetsFilesPath()
  const indexJsFileName = assetsFilesList.find(name => name.match(/^index.[a-f0-9]{8}.js$/))
  const indexJsFilePath = join(assetsFilesPath, indexJsFileName)
  const tempJsFilePath = join(assetsFilesPath, 'temp.js')
  await laxcmd(`npx rollup -i ${indexJsFilePath} -o ${tempJsFilePath} -f iife`, false)
  console.log('bundled together into temp.js')
  await cmd(`rm -rf ${indexJsFilePath}`)
  console.log(`deleted original ${indexJsFileName}`)
  await cmd(`mv ${tempJsFilePath} ${indexJsFilePath}`)
  console.log(`renamed temp.js into ${indexJsFileName}`)
  console.log(chalk.green('\nRolledup index and vendor into a single IIFE.\n'))
}

async function removeSourceMaps () {
  console.log(chalk.bold('\n🧹 Removing source maps...\n'))
  const assetsFilesList = await listAssetsInBuild()
  const sourceMapFiles = assetsFilesList.filter(fileName => fileName.match(/.js.map$/))
  console.log('found:')
  console.log(`  ${sourceMapFiles.join('\n  ')}`)
  const filesToDelete = sourceMapFiles.join(' ')
  if (!filesToDelete || filesToDelete === '*') {
    console.log(chalk.bgRed.rgb(255, 255, 255)('ARE YOU CRAZY ???'))
    console.log(chalk.bgRed.rgb(255, 255, 255)(`You want to: rm -rf ${filesToDelete}`))
    console.log(chalk.bgRed.rgb(255, 255, 255)('I won\'t do such a thing. Bye now.'))
    return process.exit(1)
  }
  await cmd(`rm -rf ${filesToDelete}`)
  console.log(chalk.green('\nRemoved source maps.\n'))
}

async function removeVendor () {
  console.log(chalk.bold('\n🧹 Removing vendor...\n'))
  const assetsFilesList = await listAssetsInBuild()
  const assetsFilesPath = await getAssetsFilesPath()
  const vendorJsFileName = assetsFilesList.find(name => name.match(/^vendor.[a-f0-9]{8}.js$/))
  const vendorJsFilePath = join(assetsFilesPath, vendorJsFileName)
  console.log('found:')
  console.log(`  ${vendorJsFileName}`)
  if (!vendorJsFilePath || vendorJsFilePath === '*') {
    console.log(chalk.bgRed.rgb(255, 255, 255)('ARE YOU CRAZY ???'))
    console.log(chalk.bgRed.rgb(255, 255, 255)(`You want to: rm -rf ${vendorJsFilePath}`))
    console.log(chalk.bgRed.rgb(255, 255, 255)('I won\'t do such a thing. Bye now.'))
    return process.exit(1)
  }
  await cmd(`rm -rf ${vendorJsFilePath}`)
  console.log(chalk.green('\nRemoved vendor.\n'))
}

// async function lol () {
//   await copySourceToTemp()
//   await stripDevElementsInIndex()
//   await buildFromTemp()
//   await deleteTemp()
// }

// lol()

async function editFile (path, transformation, verbose = true) {
  const fileContent = readFileSync(path, { encoding: 'utf8' })
  const transformed = await transformation(fileContent)
  if (verbose) {
    console.log(path)
    console.log(chalk.bold('\nINPUT:\n'))
    console.log(chalk.grey(fileContent))
    console.log(chalk.bold('\nOUTPUT:\n'))
    console.log(chalk.grey(transformed))
    const ok = await confirm('Do you want to save this file? (y/n)')
    if (ok) {
      const result = writeFileSync(path, transformed)
      console.log(chalk.green(`\nSaved ${path}\n`))
      return result
    } else {
      console.log(chalk.red(`\nedition aborted on ${path}\n`))
      throw new Error('File edition aborted.')
    }
  }
  return writeFileSync(path, transformed)
}

async function editHtml (path, transformation, verbose = true) {
  const fileContent = readFileSync(path, { encoding: 'utf8' })
  const dom = new JSDOM(fileContent)
  const rawTransformed = await transformation(dom.window.document)
  const transformed = rawTransformed?.documentElement !== undefined
    ? rawTransformed.documentElement.outerHTML
    : ''
  if (verbose) {
    console.log(path)
    console.log(chalk.bold('\nINPUT:\n'))
    console.log(chalk.grey(fileContent))
    console.log(chalk.bold('\nOUTPUT:\n'))
    console.log(chalk.grey(transformed))
    const ok = await confirm('Do you want to save this file? (y/n)')
    if (ok) {
      const result = writeFileSync(path, transformed)
      console.log(chalk.green(`\nSaved ${path}\n`))
      return result
    } else {
      console.log(chalk.red(`\nedition aborted on ${path}\n`))
      throw new Error('File edition aborted.')
    }
  }
  return writeFileSync(path, transformed)
}

async function confirm (_question = 'Continue ? (y/n)') {
  const question = _question.reset
    ? _question
    : chalk.bold.rgb(255, 255, 255).bgRed(_question)
  const userInput = await prompt(question)
  return userInput.match(/^y$/i)
}

async function prettifyHtml (path, verbose = true) {
  await editHtml(path, $document => {
    const outerHtml = $document.documentElement.outerHTML
    const prettified = pretty(outerHtml, { ocd: true })
    const $newDocument = new JSDOM(prettified).window.document
    return $newDocument
  }, verbose)
}

export {
  cmd,
  laxcmd,
  updatePreload,
  emptyPreload,
  lint,
  checkGitStatus,
  handleGitStatus,
  copySourceToTemp,
  stripDevElementsInIndex,
  buildFromTemp,
  deleteTemp,
  listAssetsInBuild,
  rollupIndexAndVendor,
  removeSourceMaps,
  removeVendor,
  editFile,
  editHtml,
  confirm,
  prettifyHtml
}
