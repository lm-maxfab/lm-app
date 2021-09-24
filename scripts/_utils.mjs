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
import zipDir from 'zip-dir'
import { exec as _exec } from 'child_process'

import {
  ROOT_DIR_PATH,
  BUILD_CONFIG_JSON_PATH,
  BUILD_CONFIG_JSON_REL_PATH,
  INDEX_HTML_PATH,
  INDEX_HTML_REL_PATH,
  STATIC_DIR_PATH,
  STATIC_DIR_REL_PATH,
  SRC_DIR_PATH,
  CONFIG_JSON_PATH,
  PRELOAD_TS_PATH,
  PRELOAD_TS_REL_PATH,
  TEMP_DIR_PATH,
  TEMP_DIR_REL_PATH,
  TEMP_INDEX_HTML_PATH,
  TEMP_INDEX_HTML_REL_PATH,
  TEMP_STATIC_DIR_PATH,
  TEMP_STATIC_DIR_REL_PATH,
  TEMP_SRC_DIR_PATH,
  TEMP_SRC_DIR_REL_PATH,
  TEMP_CONFIG_JSON_PATH,
  TEMP_CONFIG_JSON_REL_PATH,
  TEMP_PRELOAD_TS_PATH,
  TEMP_PRELOAD_TS_REL_PATH,
  TEMP_CURRENT_BUILD_DIR_PATH,
  TEMP_CURRENT_BUILD_DIR_REL_PATH,
  TEMP_CURRENT_BUILD_INDEX_HTML_PATH,
  TEMP_CURRENT_BUILD_ASSETS_DIR_NAME,
  TEMP_CURRENT_BUILD_ASSETS_DIR_PATH,
  TEMP_CURRENT_BUILD_ROLLEDUP_JS_PATH,
  TEMP_CURRENT_BUILD_ROLLEDUP_JS_REL_PATH,
  TEMP_FINAL_BUILD_DIR_PATH,
  BUILD_DIR_PATH,
  listFilesInTempCurrentBuildAssets,
  getTempCurrentBuildIndexJsPath,
  getTempCurrentBuildVendorJsPath,
  getTempCurrentBuildIndexCssPath
} from './_paths.mjs'

const exec = promisify(_exec)

export const BUILD_CONFIG = JSON.parse(readFileSync(BUILD_CONFIG_JSON_PATH, { encoding: 'utf8' }))
export const CONFIG = JSON.parse(readFileSync(CONFIG_JSON_PATH, { encoding: 'utf8' }))

/* * * * * * * * * * * * * * * * * * * * * * *
 *
 * LOG
 * 
 * * * * * * * * * * * * * * * * * * * * * * */
export async function log (content, quiet = false) {
  if (!quiet) console.log(content)
}

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

// export const ROOT_DIR_PATH = process.cwd()

// export const BUILD_CONFIG_JSON_PATH = join(ROOT_DIR_PATH, 'build.config.json')
// export const BUILD_CONFIG_JSON_REL_PATH = relative(ROOT_DIR_PATH, BUILD_CONFIG_JSON_PATH)
// export const BUILD_CONFIG = JSON.parse(readFileSync(BUILD_CONFIG_JSON_PATH, { encoding: 'utf8' }))

// export const INDEX_HTML_PATH = join(ROOT_DIR_PATH, 'index.html')
// export const INDEX_HTML_REL_PATH = relative(ROOT_DIR_PATH, INDEX_HTML_PATH)

// export const STATIC_DIR_PATH = join(ROOT_DIR_PATH, 'static')
// export const STATIC_DIR_REL_PATH = relative(ROOT_DIR_PATH, STATIC_DIR_PATH)

// export const DEV_STATIC_DIR_PATH = join(ROOT_DIR_PATH, 'static.dev')
// export const DEV_STATIC_DIR_REL_PATH = relative(ROOT_DIR_PATH, DEV_STATIC_DIR_PATH)

// export const SRC_DIR_PATH = join(ROOT_DIR_PATH, 'src')
// export const SRC_DIR_REL_PATH = relative(ROOT_DIR_PATH, SRC_DIR_PATH)

// export const CONFIG_JSON_PATH = join(SRC_DIR_PATH, 'config.json')
// export const CONFIG_JSON_REL_PATH = relative(ROOT_DIR_PATH, CONFIG_JSON_PATH)
// export const CONFIG = JSON.parse(readFileSync(CONFIG_JSON_PATH, { encoding: 'utf8' }))

// export const PRELOAD_TS_PATH = join(SRC_DIR_PATH, 'preload.ts')
// export const PRELOAD_TS_REL_PATH = relative(ROOT_DIR_PATH, PRELOAD_TS_PATH)

// export const TEMP_DIR_PATH = join(ROOT_DIR_PATH, '.temp')
// export const TEMP_DIR_REL_PATH = relative(ROOT_DIR_PATH, TEMP_DIR_PATH)

// export const TEMP_INDEX_HTML_PATH = join(TEMP_DIR_PATH, 'index.html')
// export const TEMP_INDEX_HTML_REL_PATH = relative(ROOT_DIR_PATH, TEMP_INDEX_HTML_PATH)

// export const TEMP_STATIC_DIR_PATH = join(TEMP_DIR_PATH, 'static')
// export const TEMP_STATIC_DIR_REL_PATH = relative(ROOT_DIR_PATH, TEMP_STATIC_DIR_PATH)

// export const TEMP_SRC_DIR_PATH = join(TEMP_DIR_PATH, 'src')
// export const TEMP_SRC_DIR_REL_PATH = relative(ROOT_DIR_PATH, TEMP_SRC_DIR_PATH)

// export const TEMP_CONFIG_JSON_PATH = join(TEMP_SRC_DIR_PATH, 'config.json')
// export const TEMP_CONFIG_JSON_REL_PATH = relative(ROOT_DIR_PATH, TEMP_CONFIG_JSON_PATH)

// export const TEMP_PRELOAD_TS_PATH = join(TEMP_SRC_DIR_PATH, 'preload.ts')
// export const TEMP_PRELOAD_TS_REL_PATH = relative(ROOT_DIR_PATH, TEMP_PRELOAD_TS_PATH)

// export const TEMP_CURRENT_BUILD_DIR_NAME = '2a908cd8c20b-temp-current-build'
// export const TEMP_CURRENT_BUILD_DIR_PATH = join(TEMP_DIR_PATH, TEMP_CURRENT_BUILD_DIR_NAME)
// export const TEMP_CURRENT_BUILD_DIR_REL_PATH = relative(ROOT_DIR_PATH, TEMP_CURRENT_BUILD_DIR_PATH)

// export const TEMP_CURRENT_BUILD_INDEX_HTML_PATH = join(TEMP_CURRENT_BUILD_DIR_PATH, 'index.html')
// export const TEMP_CURRENT_BUILD_INDEX_HTML_REL_PATH = relative(ROOT_DIR_PATH, TEMP_CURRENT_BUILD_INDEX_HTML_PATH)

// export const TEMP_CURRENT_BUILD_ASSETS_DIR_NAME = '8b575a2c19a9-temp-assets'
// export const TEMP_CURRENT_BUILD_ASSETS_DIR_PATH = join(TEMP_CURRENT_BUILD_DIR_PATH, TEMP_CURRENT_BUILD_ASSETS_DIR_NAME)
// export const TEMP_CURRENT_BUILD_ASSETS_DIR_REL_PATH = relative(ROOT_DIR_PATH, TEMP_CURRENT_BUILD_ASSETS_DIR_PATH)

// export const TEMP_CURRENT_BUILD_ROLLEDUP_JS_NAME = 'rolledup.js'
// export const TEMP_CURRENT_BUILD_ROLLEDUP_JS_PATH = join(TEMP_CURRENT_BUILD_ASSETS_DIR_PATH, TEMP_CURRENT_BUILD_ROLLEDUP_JS_NAME)
// export const TEMP_CURRENT_BUILD_ROLLEDUP_JS_REL_PATH = relative(ROOT_DIR_PATH, TEMP_CURRENT_BUILD_ROLLEDUP_JS_PATH)

// export const TEMP_FINAL_BUILD_DIR_NAME = '7a1b559fed17-temp-final-build'
// export const TEMP_FINAL_BUILD_DIR_PATH = join(TEMP_DIR_PATH, TEMP_FINAL_BUILD_DIR_NAME)
// export const TEMP_FINAL_BUILD_DIR_REL_PATH = relative(ROOT_DIR_PATH, TEMP_FINAL_BUILD_DIR_PATH)

// export const BUILD_DIR_PATH = join(ROOT_DIR_PATH, 'build')
// export const BUILD_DIR_REL_PATH = relative(ROOT_DIR_PATH, BUILD_DIR_PATH)

// export async function listFilesInTempCurrentBuildAssets () {
//   const assetsFilesList = readdirSync(TEMP_CURRENT_BUILD_ASSETS_DIR_PATH)
//   return assetsFilesList
// }

// export async function getTempCurrentBuildIndexJsPath () {
//   const assetsList = await listFilesInTempCurrentBuildAssets()
//   const indexJsName = assetsList.find(name => name.match(/^index.[a-f0-9]{8}.js$/))
//   return join(TEMP_CURRENT_BUILD_ASSETS_DIR_PATH, indexJsName)
// }

// export async function getTempCurrentBuildVendorJsPath () {
//   const assetsList = await listFilesInTempCurrentBuildAssets()
//   const vendorJsName = assetsList.find(name => name.match(/^vendor.[a-f0-9]{8}.js$/))
//   return join(TEMP_CURRENT_BUILD_ASSETS_DIR_PATH, vendorJsName)
// }

// export async function getTempCurrentBuildIndexCssPath () {
//   const assetsList = await listFilesInTempCurrentBuildAssets()
//   const indexCssName = assetsList.find(name => name.match(/^index.[a-f0-9]{8}.css$/))
//   return join(TEMP_CURRENT_BUILD_ASSETS_DIR_PATH, indexCssName)
// }

/* * * * * * * * * * * * * * * * * * * * * * *
 *
 * BUILD PROCESS
 * 
 * * * * * * * * * * * * * * * * * * * * * * */

export async function lint (options = {}) {
  const { quiet } = options
  log(chalk.bold('\n👀 Linting...\n'), quiet)
  try {
    await cmd('npm run lint', false)
  } catch (err) {
    log(chalk.red(err.stdout), quiet)
    if (!quiet) {
      const ok = await confirm('Your code shows lint errors, do you want to continue ? (y/n): ')
      if (!ok) {
        log(chalk.bold.red('\nOk, bye.\n'), quiet)
        process.exit(1)
      }
    }
  }
  log(chalk.green('\nLinted.\n'), quiet)
}

export async function checkGitStatus (options = {}) {
  const { quiet } = options
  log(chalk.bold('\n📡 Checking git status...\n'), quiet)
  const gitStatus = await cmd('git status', false)
  log(chalk.grey(gitStatus), quiet)
  log(chalk.green('\nChecked git status.\n'), quiet)
  return gitStatus
}

export async function isGitStatusClean (options = {}) {
  const { quiet } = options
  const gitStatus = await checkGitStatus({ quiet })
  const foundLine = gitStatus.split('\n').find(line => line === 'nothing to commit, working tree clean')
  return foundLine !== undefined
}

export async function handleGitStatus (options = {}) {
  const { quiet } = options
  const gitStatusIsClean = await isGitStatusClean({ quiet })
  if (!gitStatusIsClean) {
    if (!quiet) {
      const ok = await confirm('You have uncommited changes to your code, do you want to continue ? (y/n): ')
      if (!ok) {
        log(chalk.bold.red('\nOk, bye.\n'), quiet)
        process.exit(1)
      }
    }
  }
}

export async function copySourceToTemp (options = {}) {
  const { quiet } = options
  log(chalk.bold('\n👬 Copying source files to .temp/...\n'), quiet)
  await deleteFiles(TEMP_DIR_PATH)
  await cmd(`mkdir -p ${TEMP_FINAL_BUILD_DIR_PATH}`)
  await cmd(`cp ${INDEX_HTML_PATH} ${TEMP_INDEX_HTML_PATH}`)
  await cmd(`cp -r ${SRC_DIR_PATH} ${TEMP_SRC_DIR_PATH}`)
  await cmd(`cp -r ${STATIC_DIR_PATH} ${TEMP_STATIC_DIR_PATH}`)
  log(`deleted ${TEMP_DIR_REL_PATH}`, quiet)
  log(`created ${TEMP_DIR_REL_PATH}`, quiet)
  log(`copied ${INDEX_HTML_REL_PATH} into ${TEMP_INDEX_HTML_REL_PATH}`, quiet)
  log(`copied ${SRC_DIR_PATH} into ${TEMP_SRC_DIR_REL_PATH}`, quiet)
  log(`copied ${STATIC_DIR_REL_PATH} into ${TEMP_STATIC_DIR_REL_PATH}`, quiet)
  log(chalk.green(`\nCopied source files to ${TEMP_DIR_REL_PATH}\n`), quiet)
}

export async function stripDevElementsInIndex (options = {}) {
  const { quiet } = options
  log(chalk.bold('\n✏️  Stripping dev elements in .temp/index.html...\n'), quiet)
  await editHtml(TEMP_INDEX_HTML_PATH, $document => {
    $document.querySelector('.lm-app-fake-lm-header').remove()
    log('removed div.lm-app-fake-lm-header', quiet)
    $document.querySelector('.lm-app-fake-lm-footer').remove()
    log('removed div.lm-app-fake-lm-footer', quiet)
    const $links = $document.querySelectorAll('link')
    $links.forEach($link => {
      const href = $link.getAttribute('href')
      const isToDelete = href.match(/^\.\/static\.dev/)
      if (isToDelete) {
        log(`removed link[href="${href}"]`, quiet)
        return $link.remove()
      }
    })
    return $document
  }, { quiet: true })
  log(chalk.green('\nStripped .temp/index.html dev stuff\n'), quiet)
}

export async function handleBuildConfig (options = {}) {
  const { quiet } = options
  if (!Array.isArray(BUILD_CONFIG)) {
    const message = `${BUILD_CONFIG_JSON_REL_PATH} should contain an array. Build process will stop here.`
    log(chalk.bold.rgb(255, 255, 255).bgRed(message), quiet)
    await deleteFiles(TEMP_DIR_PATH, BUILD_DIR_PATH)
    process.exit(1)
  } else if (BUILD_CONFIG.length === 0) {
    const message = 'Your build config is empty, build process will stop here.'
    log(chalk.bold.rgb(255, 255, 255).bgRed(message), quiet)
    await deleteFiles(TEMP_DIR_PATH, BUILD_DIR_PATH)
  } else if (BUILD_CONFIG.length > 1) {
    let message = `Your build config will start a build process of ${BUILD_CONFIG.length} builds.`
    message += `\n\n${JSON.stringify(BUILD_CONFIG, null, 2)}`
    message += '\n\nAre you sure you want to continue? (y/n)'
    if (!quiet) {
      const ok = await confirm(makeLinesEven(message))
      if (!ok) {
        log(chalk.bold.red('\nOk, bye.\n'), quiet)
        await deleteFiles(TEMP_DIR_PATH, BUILD_DIR_PATH)
        process.exit(1)
      }
    }
  }
}

export async function getTempConfigJson () {
  const tempConfigJson = JSON.parse(readFileSync(TEMP_CONFIG_JSON_PATH, { encoding: 'utf8' }))
  return tempConfigJson
}

export async function updateTempConfigJson (buildConfig, options = {}) {
  const { quiet } = options
  log(chalk.bold(`\n🔀 Updating ${TEMP_CONFIG_JSON_REL_PATH}...\n`), quiet)
  const currentTempConfig = await getTempConfigJson()
  const newCurrentTempConfig = {
    ...currentTempConfig,
    sheetbase_url: buildConfig.sheetbase_url ?? null,
    build_name: buildConfig.name ?? null
  }
  if (newCurrentTempConfig.sheetbase_url === null) {
    let message = 'You try to build an app with no sheetbase url:'
    message += `\n\n${JSON.stringify(buildConfig, null, 2)}`
    message += 'Do you want to continue? (y/n)'
    if (!quiet) {
      const ok = await confirm(message)
      if (!ok) {
        log(chalk.bold.red('\nOk, bye.\n'), quiet)
        await deleteFiles(TEMP_DIR_PATH, BUILD_DIR_PATH)
        process.exit(1)
      }
    }
  }
  if (newCurrentTempConfig.name === null) {
    let message = 'You try to build an app with no build name:'
    message += `\n\n${JSON.stringify(buildConfig, null, 2)}`
    message += 'The output may erase a previous unnamed output, or be erased by a future unnamed output.'
    message += 'Do you want to continue? (y/n)'
    if (!quiet) {
      const ok = await confirm(message)
      if (!ok) {
        log(chalk.bold.red('\nOk, bye.\n'), quiet)
        await deleteFiles(TEMP_DIR_PATH, BUILD_DIR_PATH)
        process.exit(1)
      }
    }
  }
  writeFileSync(TEMP_CONFIG_JSON_PATH, JSON.stringify(newCurrentTempConfig, null, 2))
  log(chalk.green(`\nUpdated ${TEMP_CONFIG_JSON_REL_PATH}\n`), quiet)
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

export async function updatePreload (options = {}) {
  const { quiet } = options
  log(chalk.bold('\n⏬ Updating spreadsheet preload...\n'), quiet)
  log('sheetbase url:', CONFIG.sheetbase_url, quiet)
  const newContents = await getUpdatedPreload()
  log('preload.ts new contents:\n', quiet)
  log(chalk.grey(newContents), quiet)
  writeFileSync(PRELOAD_TS_PATH, newContents, { encoding: 'utf8' })
  log(PRELOAD_TS_REL_PATH, quiet)
  log(chalk.green('\nUpdated preload.\n'), quiet)
}

export async function updateTempPreload (options = {}) {
  const { quiet } = options
  log(chalk.bold('\n⏬ Updating spreadsheet preload...\n'), quiet)
  log('sheetbase url:', CONFIG.sheetbase_url, quiet)
  const newContents = await getUpdatedPreload()
  log('preload.ts new contents:\n', quiet)
  log(chalk.grey(newContents), quiet)
  writeFileSync(TEMP_PRELOAD_TS_PATH, newContents, { encoding: 'utf8' })
  log(TEMP_PRELOAD_TS_REL_PATH, quiet)
  log(chalk.green('\nUpdated preload.\n'), quiet)
}

export async function emptyPreload (options = {}) {
  const { quiet } = options
  log(chalk.bold('\n🕳 Emptying spreadsheet preload...\n'), quiet)
  const preloadContent = 'const preload = `key	name	type`\n\nexport default preload\n'
  log('preload.ts new contents:\n', quiet)
  log(chalk.grey(replacedPreloadJsContent), quiet)
  writeFileSync(PRELOAD_TS_PATH, preloadContent, { encoding: 'utf8' })
  log(chalk.green('\nUpdated preload.\n'), quiet)
  return preloadContent
}

export async function buildFromTemp (options = {}) {
  const { quiet } = options
  log(chalk.bold('\n🏗️  Building the app with Vite...\n'), quiet)
  await deleteFiles(TEMP_CURRENT_BUILD_DIR_PATH)
  log(`deleted ${TEMP_CURRENT_BUILD_DIR_REL_PATH}`, quiet)
  try {
    await cmd('tsc && vite build', !quiet)
    log(`built to ${TEMP_CURRENT_BUILD_DIR_REL_PATH}`, quiet)
    log(chalk.green('\nBuilt app with Vite.\n'), quiet)
  } catch (err) {
    log(chalk.red(err.trim()), quiet)
    if (!quiet) {
      const ok = await confirm('\nSome errors occured during build, do you want to continue ? (y/n): ')
      if (!ok) {
        log(chalk.bold.red('\nOk, bye.\n'), quiet)
        await deleteFiles(TEMP_DIR_PATH, BUILD_DIR_PATH)
        process.exit(1)
      }
    }
  }
  log(`built to ${TEMP_CURRENT_BUILD_DIR_REL_PATH}`, quiet)
  log(chalk.green('\nBuilt app with Vite.\n'), quiet)
}

export async function rollupIndexAndVendor (options = {}) {
  const { quiet } = options
  log(chalk.bold('\n⚙️  Rollup vendor and index into a single IIFE...\n'), quiet)
  const tempCurrentBuildIndexJsFilePath = await getTempCurrentBuildIndexJsPath()
  const indexJsFileName = tempCurrentBuildIndexJsFilePath.split('/').slice(-1)[0]
  await laxcmd(`npx rollup -i ${tempCurrentBuildIndexJsFilePath} -o ${TEMP_CURRENT_BUILD_ROLLEDUP_JS_PATH} -f iife`, false)
  log(`bundled together into ${TEMP_CURRENT_BUILD_ROLLEDUP_JS_REL_PATH.split('/').slice(-1)[0]}`, quiet)
  await deleteFiles(tempCurrentBuildIndexJsFilePath)
  log(`deleted original ${indexJsFileName}`, quiet)
  await cmd(`mv ${TEMP_CURRENT_BUILD_ROLLEDUP_JS_PATH} ${tempCurrentBuildIndexJsFilePath}`)
  log(`renamed ${TEMP_CURRENT_BUILD_ROLLEDUP_JS_REL_PATH.split('/').slice(-1)[0]} into ${indexJsFileName}`, quiet)
  log(chalk.green('\nRolledup index and vendor into a single IIFE.\n'), quiet)
}

export async function deleteSourceMaps (options = {}) {
  const { quiet } = options
  log(chalk.bold('\n🧹 Deleting source maps...\n'), quiet)
  const assetsFilesList = await listFilesInTempCurrentBuildAssets()
  const sourceMapFiles = assetsFilesList
    .filter(fileName => fileName.match(/.js.map$/))
    .map(name => join(TEMP_CURRENT_BUILD_ASSETS_DIR_PATH, name))
  log('found:', quiet)
  log(`  ${sourceMapFiles.join('\n  ')}`, quiet)
  await deleteFiles(...sourceMapFiles)
  log(chalk.green('\nDeleted source maps.\n'), quiet)
}

export async function deleteVendor (options = {}) {
  const { quiet } = options
  log(chalk.bold('\n🧹 Deleting build/vendor.[hash].js...\n'), quiet)
  const vendorJsFilePath = await getTempCurrentBuildVendorJsPath()
  log('found:', quiet)
  log(`  ${vendorJsFilePath}`, quiet)
  await deleteFiles(vendorJsFilePath)
  log(chalk.green('\nDeleted build/vendor.[hash].js.\n'), quiet)
}

export async function removeVendorPreloadAndTypeModule (options = {}) {
  const { quiet } = options
  log(chalk.bold('\n🧹 Removing links to vendor and type="module" from build/index.html...\n'), quiet)
  await editHtml(TEMP_CURRENT_BUILD_INDEX_HTML_PATH, $document => {
    const $vendorJsPreload = $document.querySelector('link[rel="modulepreload"]')
    $vendorJsPreload.remove() // remove vendor.hash.js
    log(`removed link: ${$vendorJsPreload.getAttribute('href')}`, quiet)
    const $indexJsLink = $document.querySelector('script[type="module"]')
    $indexJsLink.removeAttribute('type') // remove type="module" from index.hash.js
    $document.body.append($indexJsLink)
    log(`removed type="module" from script: ${$indexJsLink.getAttribute('src')}`, quiet)
    return $document
  }, { quiet: true })
  log(chalk.green('\nRemoved links to vendor and type="module" from build/index.html\n'), quiet)
}

export async function relinkAssetsViaAssetsRootUrl (options = {}) {
  const { quiet } = options
  log(chalk.bold('\n🔗 Relinking assets in index.html, index.[hash].js and index.[hash].css...\n'), quiet)
  const assetsRootUrl = CONFIG.assets_root_url === null ? `./assets` : CONFIG.assets_root_url
  const assetsDirRegexp = new RegExp(`\/${TEMP_CURRENT_BUILD_ASSETS_DIR_NAME}`, 'gm')
  const indexJsFilePath = await getTempCurrentBuildIndexJsPath()
  const indexCssFilePath = await getTempCurrentBuildIndexCssPath()
  log(`replacing /${TEMP_CURRENT_BUILD_ASSETS_DIR_NAME} with ${assetsRootUrl}...\n`, quiet)
  const replacer = (contents, path) => {
    const fileName = relative(ROOT_DIR_PATH, path)
    const occurences = contents.match(assetsDirRegexp)
    log(`${fileName}: ${occurences !== null ? occurences.length : '0'} occurences.`, quiet)
    return contents.replace(assetsDirRegexp, assetsRootUrl)
  }
  await editFile(TEMP_CURRENT_BUILD_INDEX_HTML_PATH, replacer, { quiet: true })
  await editFile(indexJsFilePath, replacer, { quiet: true })
  await editFile(indexCssFilePath, replacer, { quiet: true })
  log(chalk.green('\nRelinked assets.\n'), quiet)
}

export async function getBuildInfo () {
  const assetsRootUrl = CONFIG.assets_root_url === null
    ? `./assets`
    : CONFIG.assets_root_url
  const gitStatusIsClean = await isGitStatusClean({ quiet: true })
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

export async function storeBuildInfo (options = {}) {
  const { quiet } = options
  log(chalk.bold('\n✍️  Storing build info in index.html...'), quiet)
  const $buildInfoSpan = await getBuildInfoSpan()
  const toLog = $buildInfoSpan.innerHTML.replace(/\n\s{6}/gm, '\n').replace(/<\/?p>/gm, '')
  log(chalk.grey(toLog), quiet)
  await editHtml(TEMP_CURRENT_BUILD_INDEX_HTML_PATH, $document => {
    $document.body.prepend($buildInfoSpan)
    return $document
  }, { quiet: true })
  log(chalk.green('\nStored build info in index.html.\n'), quiet)
}

export async function prettifyIndexHtml (options = {}) {
  const { quiet } = options
  log(chalk.bold('\n💅  Prettifying index.html...\n'), quiet)
  await editFile(TEMP_CURRENT_BUILD_INDEX_HTML_PATH, contents => {
    const lines = contents.split('\n')
    const noBlankLines = lines.filter(line => line.trim() !== '')
    return noBlankLines.join('\n')
  }, { quiet: true })
  await editHtml(TEMP_CURRENT_BUILD_INDEX_HTML_PATH, $document => {
    const outerHtml = $document.documentElement.outerHTML
    const prettified = pretty(outerHtml, { ocd: true })
    const $newDocument = new JSDOM(prettified).window.document
    return $newDocument
  }, { quiet: true })
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
    log(chalk.grey(returned), quiet)
    return returned
  }, { quiet: true })
  log(chalk.green('Prettified index.html.\n'), quiet)
}

export async function removeDsStores (options = {}) {
  const { quiet } = options
  log(chalk.bold('\n🧹 Removing all .DS_Store files...\n'), quiet)
  await cmd(`cd ${TEMP_CURRENT_BUILD_DIR_PATH} && find . -name ".DS_Store" -print -delete && cd ${ROOT_DIR_PATH}`)
  log(chalk.green('Removed all .DS_Store files.\n'), quiet)
}

export async function createLongformAndSnippetBuildOutputs (buildConf, options = {}) {
  const { quiet } = options
  log(chalk.bold('\n🎁 Creating longform and snippet builds...\n'), quiet)
  
  const tempConfig = await getTempConfigJson()
  const normalizedAssetsRootUrl = tempConfig.assets_root_url.replace(/[^a-z0-9]+/igm, '-')
  const normalizedBuildName = buildConf.build_name.replace(/[^a-z0-9]+/igm, '-')
  
  const outAssetsDirPath = `${TEMP_CURRENT_BUILD_DIR_PATH}/assets/${normalizedAssetsRootUrl}`
  
  const outLongformDirPath = `${TEMP_CURRENT_BUILD_DIR_PATH}/longforms/${normalizedBuildName}`
  const outLongformHtmlPath = `${outLongformDirPath}/index.html`
  const outLongformHtmlRelPath = relative(ROOT_DIR_PATH, outLongformHtmlPath)
  
  const outSnippetDirPath = `${TEMP_CURRENT_BUILD_DIR_PATH}/snippets/${normalizedBuildName}`
  const outSnippetHtmlPath = `${outSnippetDirPath}/index.html`
  const outSnippetHtmlRelPath = relative(ROOT_DIR_PATH, outSnippetHtmlPath)
  
  const outZipDirPath = `${TEMP_CURRENT_BUILD_DIR_PATH}/zips`
  const outZipPath = `${outZipDirPath}/${normalizedBuildName}.zip`
  const outZipRelPath = relative(ROOT_DIR_PATH, outZipPath)
  
  await cmd(`mkdir -p ${outAssetsDirPath} ${outLongformDirPath} ${outSnippetDirPath} ${outZipDirPath}`)
  await cmd(`mv ${TEMP_CURRENT_BUILD_ASSETS_DIR_PATH}/** ${outAssetsDirPath}`)
  await deleteFiles(TEMP_CURRENT_BUILD_ASSETS_DIR_PATH)
  
  await cmd(`cp ${TEMP_CURRENT_BUILD_INDEX_HTML_PATH} ${outLongformHtmlPath}`)
  log(outLongformHtmlRelPath, quiet)

  await zipDir(outLongformDirPath, { saveTo: outZipPath })
  log(outZipRelPath, quiet)

  await cmd(`cp ${TEMP_CURRENT_BUILD_INDEX_HTML_PATH} ${outSnippetHtmlPath}`)
  await editFile(outSnippetHtmlPath, content => {
    const lines = content.split('\n')
    const linkLine = lines.find(line => line.match(/<link rel="stylesheet"/))
    const bodyStartLine = lines.findIndex(line => line.match(/<body>/))
    const bodyEndLine = lines.findIndex(line => line.match(/<\/body>/))
    const bodyLines = lines.slice(bodyStartLine + 1, bodyEndLine)
    const outLines = [linkLine, ...bodyLines].map(line => line.replace(/^\s{4}/, ''))
    const returned = `${outLines.join('\n')}\n`
    return returned
  }, { quiet: true })

  log(`${outSnippetHtmlRelPath}`, quiet)
  await cmd(`rm -rf ${TEMP_CURRENT_BUILD_INDEX_HTML_PATH}`)

  log(chalk.green('\nCreated longform and snippet builds.\n'), quiet)
}

export async function rsyncToTempFinal (options = {}) {
  const { quiet } = options
  log(chalk.bold(`\n⌚ Rsyncing current build with other builds...\n`), quiet)
  await cmd(`rsync -a ${TEMP_CURRENT_BUILD_DIR_PATH}/ ${TEMP_FINAL_BUILD_DIR_PATH}/`)
  log(chalk.green(`Rsynced current build with other builds.\n`), quiet)
}

export async function moveTempFinalToBuild(options = {}) {
  const { quiet } = options
  log(chalk.bold(`\n⌚ Moving temp final to build...\n`), quiet)
  await deleteFiles(BUILD_DIR_PATH)
  await cmd(`mkdir -p ${BUILD_DIR_PATH}`)
  await cmd(`cp -r ${TEMP_FINAL_BUILD_DIR_PATH}/** ${BUILD_DIR_PATH}`)
  await deleteFiles(TEMP_DIR_PATH)
  log(chalk.green(`Moved temp final to build\n`), quiet)
}

export async function editFile (path, transformation, options = {}) {
  const { quiet } = options
  log(chalk.bold(`\nEdit file: ${path}`), quiet)
  const fileContent = readFileSync(path, { encoding: 'utf8' })
  const transformed = await transformation(fileContent, path)
  log(`${fileContent.length} char → ${transformed.length} char\n`, quiet)
  log('In:\n', quiet)
  log(chalk.grey(fileContent), quiet)
  log('Out:\n', quiet)
  log(chalk.grey(transformed), quiet)
  if (!quiet) {
    const ok = await confirm('Do you want to save this file? (y/n)')
    if (ok) {
      const result = writeFileSync(path, transformed)
      log(chalk.green(`\nEdited file: ${path}\n`), quiet)
      return result
    } else {
      log(chalk.red(`\nedition aborted on ${path}\n`), quiet)
      throw new Error('File edition aborted.')
    }
  }
  log(chalk.green(`\nEdited file: ${path}\n`), quiet)
  return writeFileSync(path, transformed)
}

export async function editHtml (path, transformation, options = {}) {
  const { quiet } = options
  const fileContent = readFileSync(path, { encoding: 'utf8' })
  const dom = new JSDOM(fileContent)
  const rawTransformed = await transformation(dom.window.document, path)
  const transformed = rawTransformed?.documentElement !== undefined
    ? rawTransformed.documentElement.outerHTML
    : ''
  log(chalk.bold(`\nEdit html file: ${path}`), quiet)
  log(`${fileContent.length} char → ${transformed.length} char\n`, quiet)
  log('In:\n', quiet)
  log(chalk.grey(fileContent), quiet)
  log('Out:\n', quiet)
  log(chalk.grey(transformed), quiet)
  if (!quiet) {
    const ok = await confirm('Do you want to save this file? (y/n)')
    if (ok) {
      const result = writeFileSync(path, transformed)
      log(chalk.green(`\nEdit html file: ${path}\n`), quiet)
      return result
    } else {
      log(chalk.red(`\nedition aborted on ${path}\n`), quiet)
      throw new Error('File edition aborted.')
    }
  }
  log(chalk.green(`\nEdit html file: ${path}\n`), quiet)
  return writeFileSync(path, transformed)
}

export function makeLinesEven (str) {
  const lines = str.split('\n')
  const longestLine = Math.max(...lines.map(line => line.length))
  const evenLines = lines.map(line => {
    const lineArr = line.split('')
    const blankLine = new Array(longestLine).fill(' ')
    const outLine = [
      ...lineArr,
      ...blankLine.slice(lineArr.length)
    ]
    return outLine.join('')
  })
  return evenLines.join('\n')
}

export async function confirm (_question = 'Continue ? (y/n)') {
  const question = _question.reset
    ? _question
    : chalk.bold.rgb(255, 255, 255).bgRed(_question)
  const userInput = await prompt(question)
  return userInput.match(/^y$/i)
}

export async function prettifyHtml (path, options = {}) {
  const { quiet } = options
  await editHtml(path, $document => {
    const outerHtml = $document.documentElement.outerHTML
    const prettified = pretty(outerHtml, { ocd: true })
    const $newDocument = new JSDOM(prettified).window.document
    return $newDocument
  }, { quiet })
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
