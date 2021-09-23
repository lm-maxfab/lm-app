/* eslint-disable no-tabs */
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, relative } from 'path'
import { promisify } from 'util'
import fetch from 'node-fetch'
import { JSDOM } from 'jsdom'
import prompt from 'async-prompt'
import pretty from 'pretty'
import chalk from 'chalk'
import moment from 'moment'
import { exec as _exec } from 'child_process'

const exec = promisify(_exec)

/* * * * * * * * * * * * * * * * * * * * * * *
 *
 * CMD & LAXCMD
 * 
 * * * * * * * * * * * * * * * * * * * * * * */

export async function cmd (line, verboseOpt = true) {
  const { stdout, stderr } = await exec(line)
  if (stderr) {
    if (verboseOpt) console.log(stdout)
    throw stderr
  } else if (stdout) {
    if (verboseOpt) console.log(stdout)
    return stdout
  }
}

export async function laxcmd (line, verboseOpt = true) {
  try {
    return await cmd(line, verboseOpt)
  } catch (err) {
    if (verboseOpt) console.log(err)
    return err.stdout
  }
}

/* * * * * * * * * * * * * * * * * * * * * * *
 *
 * DELETE FILES
 * 
 * * * * * * * * * * * * * * * * * * * * * * */

export async function deleteFiles(...paths) {
  const uMad = paths.some(path => {
    const isMad = typeof path !== 'string'
      || path === ''
      || path.match(/\*/gm)
      || path.match(/^\/$/)
      || path.match(/^.\/$/)
    if (isMad) {
      console.log(chalk.bgRed.rgb(255, 255, 255)('ARE YOU CRAZY ???'))
      console.log(chalk.bgRed.rgb(255, 255, 255)(`You are trying to rm -rf ${path}`))
    }
    return isMad
  })
  if (uMad) {
    console.log(chalk.bgRed.rgb(255, 255, 255)('I won\'t do such a thing. Bye now.'))
    return process.exit(1)
  }
  await cmd(`rm -rf ${paths.join(' ')}`)
}

/* * * * * * * * * * * * * * * * * * * * * * *
 *
 * FILES LOCATORS
 * 
 * * * * * * * * * * * * * * * * * * * * * * */

export const ROOT_DIR_PATH = process.cwd()

export const BUILD_CONFIG_JSON_PATH = join(ROOT_DIR_PATH, 'build.config.json')
export const BUILD_CONFIG_JSON_REL_PATH = relative(ROOT_DIR_PATH, BUILD_CONFIG_JSON_PATH)
export const BUILD_CONFIG = JSON.parse(readFileSync(BUILD_CONFIG_JSON_PATH, { encoding: 'utf8' }))

export const INDEX_HTML_PATH = join(ROOT_DIR_PATH, 'index.html')
export const INDEX_HTML_REL_PATH = relative(ROOT_DIR_PATH, INDEX_HTML_PATH)

export const STATIC_DIR_PATH = join(ROOT_DIR_PATH, 'static')
export const STATIC_DIR_REL_PATH = relative(ROOT_DIR_PATH, STATIC_DIR_PATH)

export const DEV_STATIC_DIR_PATH = join(ROOT_DIR_PATH, 'static.dev')
export const DEV_STATIC_DIR_REL_PATH = relative(ROOT_DIR_PATH, DEV_STATIC_DIR_PATH)

export const SRC_DIR_PATH = join(ROOT_DIR_PATH, 'src')
export const SRC_DIR_REL_PATH = relative(ROOT_DIR_PATH, SRC_DIR_PATH)

export const CONFIG_JSON_PATH = join(SRC_DIR_PATH, 'config.json')
export const CONFIG_JSON_REL_PATH = relative(ROOT_DIR_PATH, CONFIG_JSON_PATH)
export const CONFIG = JSON.parse(readFileSync(CONFIG_JSON_PATH, { encoding: 'utf8' }))

export const PRELOAD_TS_PATH = join(SRC_DIR_PATH, 'preload.ts')
export const PRELOAD_TS_REL_PATH = relative(ROOT_DIR_PATH, PRELOAD_TS_PATH)

export const TEMP_DIR_PATH = join(ROOT_DIR_PATH, '.temp')
export const TEMP_DIR_REL_PATH = relative(ROOT_DIR_PATH, TEMP_DIR_PATH)

export const TEMP_INDEX_HTML_PATH = join(TEMP_DIR_PATH, 'index.html')
export const TEMP_INDEX_HTML_REL_PATH = relative(ROOT_DIR_PATH, TEMP_INDEX_HTML_PATH)

export const TEMP_STATIC_DIR_PATH = join(TEMP_DIR_PATH, 'static')
export const TEMP_STATIC_DIR_REL_PATH = relative(ROOT_DIR_PATH, TEMP_STATIC_DIR_PATH)

export const TEMP_SRC_DIR_PATH = join(TEMP_DIR_PATH, 'src')
export const TEMP_SRC_DIR_REL_PATH = relative(ROOT_DIR_PATH, TEMP_SRC_DIR_PATH)

export const TEMP_CONFIG_JSON_PATH = join(TEMP_SRC_DIR_PATH, 'config.json')
export const TEMP_CONFIG_JSON_REL_PATH = relative(ROOT_DIR_PATH, TEMP_CONFIG_JSON_PATH)

export const TEMP_PRELOAD_TS_PATH = join(TEMP_SRC_DIR_PATH, 'preload.ts')
export const TEMP_PRELOAD_TS_REL_PATH = relative(ROOT_DIR_PATH, TEMP_PRELOAD_TS_PATH)

export const TEMP_CURRENT_BUILD_DIR_NAME = '2a908cd8c20b-temp-current-build'
export const TEMP_CURRENT_BUILD_DIR_PATH = join(TEMP_DIR_PATH, TEMP_CURRENT_BUILD_DIR_NAME)
export const TEMP_CURRENT_BUILD_DIR_REL_PATH = relative(ROOT_DIR_PATH, TEMP_CURRENT_BUILD_DIR_PATH)

export const TEMP_CURRENT_BUILD_INDEX_HTML_PATH = join(TEMP_CURRENT_BUILD_DIR_PATH, 'index.html')
export const TEMP_CURRENT_BUILD_INDEX_HTML_REL_PATH = relative(ROOT_DIR_PATH, TEMP_CURRENT_BUILD_INDEX_HTML_PATH)

export const TEMP_CURRENT_BUILD_ASSETS_DIR_NAME = '8b575a2c19a9-temp-assets'
export const TEMP_CURRENT_BUILD_ASSETS_DIR_PATH = join(TEMP_CURRENT_BUILD_DIR_PATH, TEMP_CURRENT_BUILD_ASSETS_DIR_NAME)
export const TEMP_CURRENT_BUILD_ASSETS_DIR_REL_PATH = relative(ROOT_DIR_PATH, TEMP_CURRENT_BUILD_ASSETS_DIR_PATH)

export const TEMP_CURRENT_BUILD_ROLLEDUP_JS_NAME = 'rolledup.js'
export const TEMP_CURRENT_BUILD_ROLLEDUP_JS_PATH = join(TEMP_CURRENT_BUILD_ASSETS_DIR_PATH, TEMP_CURRENT_BUILD_ROLLEDUP_JS_NAME)
export const TEMP_CURRENT_BUILD_ROLLEDUP_JS_REL_PATH = relative(ROOT_DIR_PATH, TEMP_CURRENT_BUILD_ROLLEDUP_JS_PATH)

export const TEMP_BUILDS_DIR_NAME = 'e598814c8fc4-temp-builds'
export const TEMP_BUILDS_DIR_PATH = join(TEMP_DIR_PATH, TEMP_BUILDS_DIR_NAME)
export const TEMP_BUILDS_DIR_REL_PATH = relative(ROOT_DIR_PATH, TEMP_BUILDS_DIR_PATH)

export const TEMP_BUILDS_FINAL_DIR_NAME = '7a1b559fed17-temp-final-build'
export const TEMP_BUILDS_FINAL_DIR_PATH = join(TEMP_BUILDS_DIR_PATH, TEMP_BUILDS_FINAL_DIR_NAME)
export const TEMP_BUILDS_FINAL_DIR_REL_PATH = relative(ROOT_DIR_PATH, TEMP_BUILDS_FINAL_DIR_PATH)

export const BUILD_DIR_PATH = join(ROOT_DIR_PATH, 'build')
export const BUILD_DIR_REL_PATH = relative(ROOT_DIR_PATH, BUILD_DIR_PATH)

export const BUILD_ASSETS_DIR_PATH = join(BUILD_DIR_PATH, 'assets')
export const BUILD_ASSETS_DIR_REL_PATH = relative(ROOT_DIR_PATH, BUILD_ASSETS_DIR_PATH)

// async function getRootDirPath () {
//   return process.cwd()
// }

// async function getConfig () {
//   const rawConfigJson = readFileSync(CONFIG_JSON_PATH, { encoding: 'utf8' })
//   const config = JSON.parse(rawConfigJson)
//   return config
// }

// async function getPreloadFilePath () {
//   const rootDirPath = await getRootDirPath()
//   return join(rootDirPath, 'src/preload.ts')
// }

// async function getTempBuildPath () {
//   const rootDirPath = await getRootDirPath()
//   return join(rootDirPath, '.temp')
// }

// async function getBuildPath () {
//   const rootDirPath = await getRootDirPath()
//   return join(rootDirPath, 'build')
// }

// async function getBuildAssetsFilesPath () {
//   const buildDirPath = await getBuildPath()
//   const assetsFilesPath = join(buildDirPath, BUILD_ASSETS_DIR_NAME)
//   return assetsFilesPath
// }

export async function listFilesInTempCurrentBuildAssets () {
  const assetsFilesList = readdirSync(TEMP_CURRENT_BUILD_ASSETS_DIR_PATH)
  return assetsFilesList
}

export async function getBuildIndexHtmlPath () {
  const buildDirPath = await getBuildPath()
  return join(buildDirPath, 'index.html')
}

export async function getTempCurrentBuildIndexJsPath () {
  const assetsList = await listFilesInTempCurrentBuildAssets()
  const indexJsName = assetsList.find(name => name.match(/^index.[a-f0-9]{8}.js$/))
  return join(TEMP_CURRENT_BUILD_ASSETS_DIR_PATH, indexJsName)
}

export async function getTempCurrentBuildVendorJsPath () {
  const assetsList = await listFilesInTempCurrentBuildAssets()
  const vendorJsName = assetsList.find(name => name.match(/^vendor.[a-f0-9]{8}.js$/))
  return join(TEMP_CURRENT_BUILD_ASSETS_DIR_PATH, vendorJsName)
}

export async function getTempCurrentBuildIndexCssPath () {
  const assetsList = await listFilesInTempCurrentBuildAssets()
  const indexCssName = assetsList.find(name => name.match(/^index.[a-f0-9]{8}.css$/))
  return join(TEMP_CURRENT_BUILD_ASSETS_DIR_PATH, indexCssName)
}

/* * * * * * * * * * * * * * * * * * * * * * *
 *
 * BUILD PROCESS
 * 
 * * * * * * * * * * * * * * * * * * * * * * */

export async function lint () {
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

export async function checkGitStatus (verbose = true) {
  if (verbose) console.log(chalk.bold('\n📡 Checking git status...\n'))
  const gitStatus = await cmd('git status', false)
  if (verbose) console.log(chalk.grey(gitStatus))
  if (verbose) console.log(chalk.green('\nChecked git status.\n'))
  return gitStatus
}

export async function isGitStatusClean (verbose = true) {
  const gitStatus = await checkGitStatus(verbose)
  const foundLine = gitStatus.split('\n').find(line => line === 'nothing to commit, working tree clean')
  return foundLine !== undefined
}

export async function handleGitStatus () {
  const gitStatusIsClean = await isGitStatusClean()
  if (!gitStatusIsClean) {
    const ok = await confirm('You have uncommited changes to your code, do you want to continue ? (y/n): ')
    if (!ok) {
      await cmd('echo "Ok, bye."')
      process.exit(1)
    }
  }
}

export async function copySourceToTemp () {
  console.log(chalk.bold('\n👬 Copying source files to .temp/...\n'))
  await deleteFiles(TEMP_DIR_PATH)
  await cmd(`mkdir -p ${TEMP_BUILDS_FINAL_DIR_PATH}`)
  await cmd(`cp ${INDEX_HTML_PATH} ${TEMP_INDEX_HTML_PATH}`)
  await cmd(`cp -r ${SRC_DIR_PATH} ${TEMP_SRC_DIR_PATH}`)
  await cmd(`cp -r ${STATIC_DIR_PATH} ${TEMP_STATIC_DIR_PATH}`)
  console.log(`deleted ${TEMP_DIR_REL_PATH}`)
  console.log(`created ${TEMP_DIR_REL_PATH}`)
  console.log(`copied ${INDEX_HTML_REL_PATH} into ${TEMP_INDEX_HTML_REL_PATH}`)
  console.log(`copied ${SRC_DIR_PATH} into ${TEMP_SRC_DIR_REL_PATH}`)
  console.log(`copied ${STATIC_DIR_REL_PATH} into ${TEMP_STATIC_DIR_REL_PATH}`)
  console.log(chalk.green(`\nCopied source files to ${TEMP_DIR_REL_PATH}\n`))
}

export async function stripDevElementsInIndex () {
  console.log(chalk.bold('\n✏️  Stripping dev elements in .temp/index.html...\n'))
  await editHtml(TEMP_INDEX_HTML_PATH, $document => {
    $document.querySelector('.lm-app-fake-lm-header').remove()
    console.log('removed div.lm-app-fake-lm-header')
    $document.querySelector('.lm-app-fake-lm-footer').remove()
    console.log('removed div.lm-app-fake-lm-footer')
    const $links = $document.querySelectorAll('link')
    $links.forEach($link => {
      const href = $link.getAttribute('href')
      const isToDelete = href.match(/^\.\/static\.dev/)
      if (isToDelete) {
        console.log(`removed link[href="${href}"]`)
        return $link.remove()
      }
    })
    return $document
  }, false)
  console.log(chalk.green('\nStripped .temp/index.html dev stuff\n'))
}

export async function getBuildInfo () {
  const assetsRootUrl = CONFIG.assets_root_url === null
    ? `./assets`
    : CONFIG.assets_root_url
  const gitStatusIsClean = await isGitStatusClean(false)
  const now = moment().toString()
  const currentBranch = await cmd('git rev-parse --abbrev-ref HEAD', false)
  const currentCommit = await cmd('git show --oneline -s', false)
  return {
    time: now,
    repo: 'https://github.com/lm-maxfab/lm-app',
    branch: currentBranch.trim(),
    commit: currentCommit.trim(),
    assets: assetsRootUrl,
    isDirty: !gitStatusIsClean
  }
}

export async function getBuildInfoSpan () {
  const buildInfo = await getBuildInfo()
  const $document = new JSDOM('<html><body></body></html>').window.document
  const $buildInfoSpan = $document.createElement('span')
  $buildInfoSpan.setAttribute('id', 'lm-app-build-info')
  $buildInfoSpan.style.display = 'none'
  $buildInfoSpan.style.fontSize = '0px'
  $buildInfoSpan.style.lineHeight = '0px'
  $buildInfoSpan.style.color = 'transparent'
  $buildInfoSpan.innerHTML += '\n      <p>BUILD INFO</p>'
  $buildInfoSpan.innerHTML += '\n      <p>==========</p>'
  $buildInfoSpan.innerHTML += `\n      <p>Time: ${buildInfo.time}</p>`
  $buildInfoSpan.innerHTML += `\n      <p>Repo: ${buildInfo.repo}</p>`
  $buildInfoSpan.innerHTML += `\n      <p>Branch: ${buildInfo.branch}</p>`
  $buildInfoSpan.innerHTML += `\n      <p>Commit: ${buildInfo.commit}</p>`
  $buildInfoSpan.innerHTML += `\n      <p>Assets: ${buildInfo.assets}</p>`
  if (buildInfo.isDirty) $buildInfoSpan.innerHTML += '\n      <p>Built with some uncommited changes.</p>'
  return $buildInfoSpan
}

export async function writeBuildInfoSpan ($buildInfoSpan) {
  await editHtml(TEMP_CURRENT_BUILD_INDEX_HTML_PATH, $document => {
    $document.body.prepend($buildInfoSpan)
    return $document
  }, false)
}

export async function storeBuildInfo () {
  console.log(chalk.bold('\n✍️  Storing build info in index.html...'))
  const $buildInfoSpan = await getBuildInfoSpan()
  const toLog = $buildInfoSpan.innerHTML.replace(/\n\s{6}/gm, '\n').replace(/<\/?p>/gm, '')
  console.log(chalk.grey(toLog))
  await writeBuildInfoSpan($buildInfoSpan)
  console.log(chalk.green('\nStored build info in index.html.\n'))
}

export async function storeBuildInfoInIndexHtml () {
  console.log(chalk.bold('\n✍️  Storing build info in index.html...'))
  const buildIndexHtmlFilePath = await getBuildIndexHtmlPath()
  const config = await getConfig()
  const assetsRootUrl = config.assets_root_url === null ? `./${BUILD_ASSETS_DIR_NAME}` : config.assets_root_url
  const gitStatusIsClean = await isGitStatusClean(false)
  await editHtml(buildIndexHtmlFilePath, async ($document) => {
    const now = moment().toString()
    const currentBranch = await cmd('git rev-parse --abbrev-ref HEAD', false)
    const currentCommit = await cmd('git show --oneline -s', false)
    const $buildInfoNode = $document.createElement('span')
    $buildInfoNode.setAttribute('id', 'lm-app-build-info')
    $buildInfoNode.style.display = 'none'
    $buildInfoNode.style.fontSize = '0px'
    $buildInfoNode.style.lineHeight = '0px'
    $buildInfoNode.style.color = 'transparent'
    $buildInfoNode.innerHTML += '\n      <p>BUILD INFO</p>'
    $buildInfoNode.innerHTML += '\n      <p>==========</p>'
    $buildInfoNode.innerHTML += `\n      <p>Time: ${now}</p>`
    $buildInfoNode.innerHTML += '\n      <p>Repo: https://github.com/lm-maxfab/lm-app</p>'
    $buildInfoNode.innerHTML += `\n      <p>Branch: ${currentBranch.trim()}</p>`
    $buildInfoNode.innerHTML += `\n      <p>Commit: ${currentCommit.trim()}</p>`
    $buildInfoNode.innerHTML += `\n      <p>Assets: ${assetsRootUrl}</p>`
    if (!gitStatusIsClean) $buildInfoNode.innerHTML += '\n      <p>Built with some uncommited changes.</p>'
    const toLog = $buildInfoNode.innerHTML
      .replace(/\n\s{6}/gm, '\n')
      .replace(/<\/?p>/gm, '')
    console.log(chalk.grey(toLog))
    $document.body.prepend($buildInfoNode)
    return $document
  }, false)
  console.log(chalk.green('\nStored build info in index.html.\n'))
}

export async function handleBuildConfig () {
  if (!Array.isArray(BUILD_CONFIG)) {
    const message = `${BUILD_CONFIG_JSON_REL_PATH} should contain an array. Build process will stop here.`
    console.log(chalk.bold.rgb(255, 255, 255).bgRed(message))
    await deleteFiles(TEMP_DIR_PATH, BUILD_DIR_PATH)
    process.exit(1)
  } else if (BUILD_CONFIG.length === 0) {
    const message = 'Your build config is empty, build process will stop here.'
    console.log(chalk.bold.rgb(255, 255, 255).bgRed(message))
    await deleteFiles(TEMP_DIR_PATH, BUILD_DIR_PATH)
  } else if (BUILD_CONFIG.length > 1) {
    let message = `Your build config will start a build process of ${BUILD_CONFIG.length} builds.`
    message += `\n\n${JSON.stringify(BUILD_CONFIG, null, 2)}`
    message += '\n\nAre you sure you want to continue? (y/n)'
    const ok = await confirm(message)
    if (!ok) {
      console.log(chalk.bold.red('\nOk, bye.\n'))
      await deleteFiles(TEMP_DIR_PATH, BUILD_DIR_PATH)
      process.exit(1)
    }
  }
}

export async function updateTempConfigJson (buildConfig) {
  console.log(chalk.bold(`🔀  Updating ${TEMP_CONFIG_JSON_REL_PATH}...`))
  const currentTempConfig = JSON.parse(readFileSync(TEMP_CONFIG_JSON_PATH, { encoding: 'utf8' }))
  const newCurrentTempConfig = {
    ...currentTempConfig,
    sheetbase_url: buildConfig.sheetbase_url ?? null,
    build_name: buildConfig.name ?? null
  }
  if (newCurrentTempConfig.sheetbase_url === null) {
    let message = 'You try to build an app with no sheetbase url:'
    message += `\n\n${JSON.stringify(buildConfig, null, 2)}`
    message += 'Do you want to continue? (y/n)'
    const ok = await confirm(message)
    if (!ok) {
      console.log(chalk.bold.red('\nOk, bye.\n'))
      await deleteFiles(TEMP_DIR_PATH, BUILD_DIR_PATH)
      process.exit(1)
    }
  }
  if (newCurrentTempConfig.name === null) {
    let message = 'You try to build an app with no build name:'
    message += `\n\n${JSON.stringify(buildConfig, null, 2)}`
    message += 'The output may erase a previous unnamed output, or be erased by a future unnamed output.'
    message += 'Do you want to continue? (y/n)'
    const ok = await confirm(message)
    if (!ok) {
      console.log(chalk.bold.red('\nOk, bye.\n'))
      await deleteFiles(TEMP_DIR_PATH, BUILD_DIR_PATH)
      process.exit(1)
    }
  }
  writeFileSync(TEMP_CONFIG_JSON_PATH, JSON.stringify(newCurrentTempConfig, null, 2))
  console.log(chalk.green(`Updated ${TEMP_CONFIG_JSON_REL_PATH}`))
}

export async function getUpdatedPreload () {
  const sheetbaseURL = CONFIG.sheetbase_url
  if (sheetbaseURL) {
    const spreadsheetDataResponse = await fetch(sheetbaseURL)
    const spreadsheetData = await spreadsheetDataResponse.text()
    const replacedPreloadJsContent = `const preload = \`${spreadsheetData}\`\n\nexport default preload\n`
    return replacedPreloadJsContent
  } else {
    const replacedPreloadJsContent = 'const preload = `key	name	type`\n\nexport default preload\n'
    return replacedPreloadJsContent
  }
}

export async function updatePreload () {
  console.log(chalk.bold('\n⏬ Updating spreadsheet preload...\n'))
  console.log('sheetbase url:', CONFIG.sheetbase_url)
  const newContents = await getUpdatedPreload()
  console.log('preload.ts new contents:\n')
  console.log(chalk.grey(newContents))
  writeFileSync(PRELOAD_TS_PATH, newContents, { encoding: 'utf8' })
  console.log(PRELOAD_TS_REL_PATH)
  console.log(chalk.green('\nUpdated preload.\n'))
}

export async function updateTempPreload () {
  console.log(chalk.bold('\n⏬ Updating spreadsheet preload...\n'))
  console.log('sheetbase url:', CONFIG.sheetbase_url)
  const newContents = await getUpdatedPreload()
  console.log('preload.ts new contents:\n')
  console.log(chalk.grey(newContents))
  writeFileSync(TEMP_PRELOAD_TS_PATH, newContents, { encoding: 'utf8' })
  console.log(TEMP_PRELOAD_TS_REL_PATH)
  console.log(chalk.green('\nUpdated preload.\n'))
}

export async function emptyPreload () {
  console.log(chalk.bold('\n🕳 Emptying spreadsheet preload...\n'))
  const preloadContent = 'const preload = `key	name	type`\n\nexport default preload\n'
  console.log('preload.ts new contents:\n')
  console.log(chalk.grey(replacedPreloadJsContent))
  writeFileSync(PRELOAD_TS_PATH, preloadContent, { encoding: 'utf8' })
  console.log(chalk.green('\nUpdated preload.\n'))
  return preloadContent
}

export async function buildFromTemp () {
  console.log(chalk.bold('\n🏗️  Building the app with Vite...\n'))
  await deleteFiles(TEMP_CURRENT_BUILD_DIR_PATH)
  console.log(`deleted ${TEMP_CURRENT_BUILD_DIR_REL_PATH}`)
  try {
    await cmd('tsc && vite build')
    console.log(`built to ${TEMP_CURRENT_BUILD_DIR_REL_PATH}`)
    console.log(chalk.green('\nBuilt app with Vite.\n'))
  } catch (err) {
    console.log(chalk.red(err.trim()))
    const ok = await confirm('\nSome errors occured during build, do you want to continue ? (y/n): ')
    if (!ok) {
      console.log(chalk.bold.red('\nOk, bye.\n'))
      await deleteFiles(TEMP_DIR_PATH, BUILD_DIR_PATH)
      process.exit(1)
    } else {
      console.log(`built to ${TEMP_CURRENT_BUILD_DIR_REL_PATH}`)
      console.log(chalk.green('\nBuilt app with Vite.\n'))
    }
  }
}

export async function rollupIndexAndVendor () {
  console.log(chalk.bold('\n⚙️  Rollup vendor and index into a single IIFE...\n'))
  const tempCurrentBuildIndexJsFilePath = await getTempCurrentBuildIndexJsPath()
  const indexJsFileName = tempCurrentBuildIndexJsFilePath.split('/').slice(-1)[0]
  await laxcmd(`npx rollup -i ${tempCurrentBuildIndexJsFilePath} -o ${TEMP_CURRENT_BUILD_ROLLEDUP_JS_PATH} -f iife`, false)
  console.log(`bundled together into ${TEMP_CURRENT_BUILD_ROLLEDUP_JS_REL_PATH.split('/').slice(-1)[0]}`)
  await deleteFiles(tempCurrentBuildIndexJsFilePath)
  console.log(`deleted original ${indexJsFileName}`)
  await cmd(`mv ${TEMP_CURRENT_BUILD_ROLLEDUP_JS_PATH} ${tempCurrentBuildIndexJsFilePath}`)
  console.log(`renamed ${TEMP_CURRENT_BUILD_ROLLEDUP_JS_REL_PATH.split('/').slice(-1)[0]} into ${indexJsFileName}`)
  console.log(chalk.green('\nRolledup index and vendor into a single IIFE.\n'))
}

export async function deleteSourceMaps () {
  console.log(chalk.bold('\n🧹 Deleting source maps...\n'))
  const assetsFilesList = await listFilesInTempCurrentBuildAssets()
  const sourceMapFiles = assetsFilesList
    .filter(fileName => fileName.match(/.js.map$/))
    .map(name => join(TEMP_CURRENT_BUILD_ASSETS_DIR_PATH, name))
  console.log('found:')
  console.log(`  ${sourceMapFiles.join('\n  ')}`)
  await deleteFiles(...sourceMapFiles)
  console.log(chalk.green('\nDeleted source maps.\n'))
}

export async function deleteVendor () {
  console.log(chalk.bold('\n🧹 Deleting build/vendor.[hash].js...\n'))
  const vendorJsFilePath = await getTempCurrentBuildVendorJsPath()
  console.log('found:')
  console.log(`  ${vendorJsFilePath}`)
  await deleteFiles(vendorJsFilePath)
  console.log(chalk.green('\nDeleted build/vendor.[hash].js.\n'))
}

export async function removeVendorPreloadAndTypeModule () {
  console.log(chalk.bold('\n🧹 Removing links to vendor and type="module" from build/index.html...\n'))
  await editHtml(TEMP_CURRENT_BUILD_INDEX_HTML_PATH, $document => {
    const $vendorJsPreload = $document.querySelector('link[rel="modulepreload"]')
    $vendorJsPreload.remove() // remove vendor.hash.js
    console.log(`removed link: ${$vendorJsPreload.getAttribute('href')}`)
    const $indexJsLink = $document.querySelector('script[type="module"]')
    $indexJsLink.removeAttribute('type') // remove type="module" from index.hash.js
    $document.body.append($indexJsLink)
    console.log(`removed type="module" from script: ${$indexJsLink.getAttribute('src')}`)
    return $document
  }, false)
  console.log(chalk.green('\nRemoved links to vendor and type="module" from build/index.html\n'))
}

export async function relinkAssetsViaAssetsRootUrl () {
  console.log(chalk.bold('\n🔗 Relinking assets in index.html, index.[hash].js and index.[hash].css...\n'))
  const assetsRootUrl = CONFIG.assets_root_url === null ? `./assets` : CONFIG.assets_root_url
  const assetsDirRegexp = new RegExp(`\/${TEMP_CURRENT_BUILD_ASSETS_DIR_NAME}`, 'gm')
  const indexJsFilePath = await getTempCurrentBuildIndexJsPath()
  const indexCssFilePath = await getTempCurrentBuildIndexCssPath()
  console.log(`replacing /${TEMP_CURRENT_BUILD_ASSETS_DIR_NAME} with ${assetsRootUrl}...\n`)
  const replacer = (contents, path) => {
    const fileName = relative(ROOT_DIR_PATH, path)
    const occurences = contents.match(assetsDirRegexp)
    console.log(`${fileName}: ${occurences !== null ? occurences.length : '0'} occurences.`)
    return contents.replace(assetsDirRegexp, assetsRootUrl)
  }
  await editFile(TEMP_CURRENT_BUILD_INDEX_HTML_PATH, replacer, false)
  await editFile(indexJsFilePath, replacer, false)
  await editFile(indexCssFilePath, replacer, false)
  console.log(chalk.green('\nRelinked assets.\n'))
}

export async function prettifyIndexHtml () {
  console.log(chalk.bold('\n💅  Prettifying index.html...\n'))
  await editFile(TEMP_CURRENT_BUILD_INDEX_HTML_PATH, contents => {
    const lines = contents.split('\n')
    const noBlankLines = lines.filter(line => line.trim() !== '')
    return noBlankLines.join('\n')
  }, false)
  await prettifyHtml(TEMP_CURRENT_BUILD_INDEX_HTML_PATH, false)
  await editFile(TEMP_CURRENT_BUILD_INDEX_HTML_PATH, contents => {
    const lines = contents.split('\n')
    const newLines = lines.map((line, i) => {
      if (line.match(/><head>/)) return line.replace(/><head>/, '>\n  <head>')
      else if (line.match(/<body><span/)) return line.replace(/<body><span/, '<body>\n    <span')
      else if (line.match(/<\/p><\/span>/)) return line.replace(/<\/p><\/span>/, '</p>\n    </span>')
      else if (line.match(/<\/body><\/html>/)) return line.replace(/<\/body><\/html>/, '  </body>\n</html>\n')
      return line
    }).filter(line => line.trim() !== '')
    const returned = newLines.join('\n')
    console.log(chalk.grey(returned))
    return returned
  }, false)
  console.log(chalk.green('Prettified index.html.\n'))
}

export async function removeDsStores () {
  console.log(chalk.bold('\n🧹 Removing all .DS_Store files...\n'))
  await cmd(`cd ${TEMP_CURRENT_BUILD_DIR_PATH} && find . -name ".DS_Store" -print -delete && cd ${ROOT_DIR_PATH}`)
  console.log(chalk.green('Removed all .DS_Store files.\n'))
}

export async function createLongformAndSnippetBuildOutputs () {
  console.log(chalk.bold('\n🎁 Creating longform and snippet builds...\n'))
  await cmd(`mv ${TEMP_CURRENT_BUILD_ASSETS_DIR_PATH} ${TEMP_CURRENT_BUILD_DIR_PATH}/assets`)
  await cmd(`mkdir ${TEMP_CURRENT_BUILD_DIR_PATH}/longform ${TEMP_CURRENT_BUILD_DIR_PATH}/snippet`)
  await cmd(`cp ${TEMP_CURRENT_BUILD_INDEX_HTML_PATH} ${TEMP_CURRENT_BUILD_DIR_PATH}/longform/index.html`)
  console.log(`${TEMP_CURRENT_BUILD_DIR_REL_PATH}/longform/index.html`)
  await cmd(`cd ${TEMP_CURRENT_BUILD_DIR_PATH} && zip -r longform.zip longform && cd ../`, false)
  console.log(`${TEMP_CURRENT_BUILD_DIR_REL_PATH}/longform.zip`)
  await cmd(`cp ${TEMP_CURRENT_BUILD_INDEX_HTML_PATH} ${TEMP_CURRENT_BUILD_DIR_PATH}/snippet/index.html`)
  const snippetIndexHtmlFilePath = join(TEMP_CURRENT_BUILD_DIR_PATH, 'snippet/index.html')
  await editFile(snippetIndexHtmlFilePath, content => {
    const lines = content.split('\n')
    const linkLine = lines.find(line => line.match(/<link rel="stylesheet"/))
    const bodyStartLine = lines.findIndex(line => line.match(/<body>/))
    const bodyEndLine = lines.findIndex(line => line.match(/<\/body>/))
    const bodyLines = lines.slice(bodyStartLine + 1, bodyEndLine)
    const outLines = [linkLine, ...bodyLines].map(line => line.replace(/^\s{4}/, ''))
    const returned = `${outLines.join('\n')}\n`
    return returned
  }, false)
  console.log(`${TEMP_CURRENT_BUILD_DIR_REL_PATH}/snippet/index.html`)
  await cmd(`rm -rf ${TEMP_CURRENT_BUILD_INDEX_HTML_PATH}`)
  console.log(chalk.green('\nCreated longform and snippet builds.\n'))
}

export async function editFile (path, transformation, verbose = true) {
  const fileContent = readFileSync(path, { encoding: 'utf8' })
  const transformed = await transformation(fileContent, path)
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

export async function editHtml (path, transformation, verbose = true) {
  const fileContent = readFileSync(path, { encoding: 'utf8' })
  const dom = new JSDOM(fileContent)
  const rawTransformed = await transformation(dom.window.document, path)
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

export async function confirm (_question = 'Continue ? (y/n)') {
  const question = _question.reset
    ? _question
    : chalk.bold.rgb(255, 255, 255).bgRed(_question)
  const userInput = await prompt(question)
  return userInput.match(/^y$/i)
}

export async function prettifyHtml (path, verbose = true) {
  await editHtml(path, $document => {
    const outerHtml = $document.documentElement.outerHTML
    const prettified = pretty(outerHtml, { ocd: true })
    const $newDocument = new JSDOM(prettified).window.document
    return $newDocument
  }, verbose)
}

// export {
//   cmd,
//   laxcmd,

//   // getRootDirPath,
//   // getPreloadFilePath,
//   // getBuildAssetsFilesPath,
//   getBuildIndexHtmlPath,
//   getTempCurrentBuildIndexJsPath,
//   getBuildIndexCssPath,
//   listFilesInTempCurrentBuildAssets,

//   getBuildConfig,

//   lint,
//   checkGitStatus,
//   handleGitStatus,
//   copySourceToTemp,
//   stripDevElementsInIndex,
//   getBuildInfo,
//   getBuildInfoSpan,
//   getUpdatedPreload,
//   updatePreload,
//   updateTempPreload,
//   emptyPreload,

//   buildFromTemp,
//   rollupIndexAndVendor,
//   deleteSourceMaps,
//   deleteVendor,
//   removeVendorPreloadAndTypeModule,
//   relinkAssetsViaAssetsRootUrl,
//   storeBuildInfoInIndexHtml,
//   prettifyIndexHtml,
//   removeDsStores,
//   createLongformAndSnippetBuildOutputs,

//   editFile,
//   editHtml,
//   confirm,
//   prettifyHtml
// }
