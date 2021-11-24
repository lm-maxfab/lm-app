import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import prompts from 'prompts'
import chalk from 'chalk'
import zipDir from 'zip-dir'
import { Directory } from './modules/file-system/index.mjs'
import exec from './modules/exec-promise/index.mjs'
import {
  latestVersionIn,
  promptTargetVersionFrom,
  versionToString,
  initialVersion
} from './modules/versionning/index.mjs'

build()
process.on('SIGINT', cleanup.bind(null, 'SIGINT'))
process.on('SIGUSR1', cleanup.bind(null, 'SIGUSR1'))
process.on('SIGUSR2', cleanup.bind(null, 'SIGUSR2'))
process.on('uncaughtException', cleanup.bind(null, 'uncaughtException'))

async function build () {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const ROOT = new Directory(path.join(__dirname, '../'))

  try {
    const doVersionAndCommit = (await prompts({
      type: 'confirm',
      name: 'response',
      message: 'Do you want to version and commit this build?'
    })).response

    // Get versionning info
    const BUILDS_JSON = await ROOT.get('builds.json')
    const allBuilds = JSON.parse(await BUILDS_JSON.read())
    const branch = (await exec('git branch --show-current')).stdout.trim()
    const builds = allBuilds[branch] ?? []
    const latestBuildVersion = latestVersionIn(builds) ?? initialVersion
    const targetBuildVersion = doVersionAndCommit ? await promptTargetVersionFrom(latestBuildVersion) : undefined
    const versionName = doVersionAndCommit ? versionToString(targetBuildVersion) : undefined
    const buildTime = new Date()
    const promptsVersionDescriptionOptions = {
      type: 'text',
      name: 'description',
      message: 'Description of the build version:'
    }
    const buildDescription = doVersionAndCommit ? (await prompts(promptsVersionDescriptionOptions)).description : undefined
    const buildVersionNameWithDesc = doVersionAndCommit ? `${versionName}${buildDescription !== '' ? ' - ' + buildDescription : ''}` : undefined
    if (doVersionAndCommit) {
      console.log()
      console.log(chalk.grey(`The target version is: ${buildVersionNameWithDesc}\n`))
    }
    const linkToLive = (await prompts({
      type: 'confirm',
      name: 'response',
      message: 'Do you want this version to be live?'
    })).response
    if (doVersionAndCommit) console.log()
    if (doVersionAndCommit) console.log(chalk.bold.bgBlack.rgb(255, 255, 255)(` Preparing build of ${buildVersionNameWithDesc} `))

    // Lint
    console.log(chalk.bold('\n👀 Linting...\n'))
    try {
      const lintExec = await exec('npm run lint')
      if (lintExec.stdout !== '') console.log(chalk.grey(lintExec.stdout))
      if (lintExec.stderr !== '') {
        console.log(chalk.red(lintExec.stderr))
        const lintContinue = (await prompts({
          type: 'confirm',
          name: 'lintContinue',
          message: 'You have lint errors, do you want to continue?'
        })).lintContinue
        if (!lintContinue) throw new Error('You aborted build process due to lint errors.')
      }
    } catch (err) {
      if (err.stdout !== '') console.log(chalk.grey(err.stdout))
      if (err.stderr !== '') console.log(chalk.red(err.stderr))
      if (err.err !== '') console.log(chalk.red(err.err))
      if (err.stderr !== '' || err.err !== '') {
        const lintContinue = (await prompts({
          type: 'confirm',
          name: 'lintContinue',
          message: 'You have lint errors, do you want to continue?'
        })).lintContinue
        if (!lintContinue) throw new Error('You aborted build process due to lint errors.')
      }
    }

    // Check git status
    if (doVersionAndCommit) console.log(chalk.bold('\n📡 Checking git status...\n'))
    const gitStatus = await exec('git status')
    if (doVersionAndCommit && gitStatus.stdout !== '') console.log(chalk.grey(gitStatus.stdout.trim()))
    if (doVersionAndCommit && gitStatus.stderr !== '') console.log(chalk.grey(gitStatus.stderr.trim()))
    console.log()
    const readyToPush = doVersionAndCommit
      ? (await prompts({
        type: 'confirm',
        name: 'push',
        message: 'Do you want to add, commit and push as is or abort ?'
      })).push
      : undefined
    if (doVersionAndCommit && !readyToPush) {
      throw new Error('Build process needs to commit and push every changes in the current branch.')
    }

    // Move all buildable to .build
    console.log(chalk.bold('\n👬 Copying source files to .build/source...\n'))
    if ((await ROOT.get('.build') === undefined)) await ROOT.mkdir('.build')
    else await ROOT.emptyQuiet('.build')
    await ROOT.mkdir('.build/source')
    const SRC_INDEX = await ROOT.copy('index.html', '.build/source/index.html')
    await SRC_INDEX.editHTMLQuiet(jsdom => {
      const documentElement = jsdom.window.document.documentElement
      const $deleteAtBuild = documentElement.querySelectorAll('.delete-at-build')
      $deleteAtBuild.forEach(elt => elt.remove())
      return jsdom
    })
    await ROOT.copy('src', '.build/source/src')
    await ROOT.copy('static', '.build/source/static')
    console.log(chalk.grey('copied.'))

    // Build
    console.log(chalk.bold('\n🏗️  Building the app with Vite...\n'))
    const buildExec = await exec('tsc && vite build')
    if (buildExec.stdout !== '') console.log(chalk.grey(buildExec.stdout.trim()))
    if (buildExec.stderr !== '') console.log(chalk.red(buildExec.stderr.trim()))

    // Move unbuilt statics to .build/destination/lm-assets-for-vite-build
    console.log(chalk.bold('\n👬 Copying unbuilt static/app/scripts files to .build/destination/lm-assets-for-vite-build...\n'))
    const DST = await ROOT.get('.build/destination')
    const DST_ASSETS = await DST.get('lm-assets-for-vite-build')
    const SRC_STATIC_APP_SCRIPTS = await ROOT.get('.build/source/static/app/scripts')
    const srcStaticAppScriptsFiles = await SRC_STATIC_APP_SCRIPTS.list()
    for (const file of srcStaticAppScriptsFiles) {
      if (file.name === '.DS_Store') continue
      const COPIED = await file.copyTo(`../../../../destination/lm-assets-for-vite-build/${file.name}`)
      const minified = await minify(await COPIED.read())
      await COPIED.writeQuiet(minified.code)
    }
    console.log(chalk.grey('copied.'))

    // Bundle vendor and index js into a single iife
    console.log(chalk.bold('\n⚙️  Bundle vendor and index into a single IIFE...\n'))
    const dstAssetsFiles = await DST_ASSETS.list()
    const DST_INDEX_JS = dstAssetsFiles.find(file => file.name.match(/^index.[a-f0-9]{8}.js$/gm))
    const DST_VENDOR_JS = dstAssetsFiles.find(file => file.name.match(/^vendor.[a-f0-9]{8}.js$/gm))
    const DST_INDEX_CSS = dstAssetsFiles.find(file => file.name.match(/^index.[a-f0-9]{8}.css$/gm))
    const rollupExec = await exec(`npx rollup -i ${DST_INDEX_JS.path} -o ${path.join(DST_ASSETS.path, 'rolledup.js')} -f iife`)
    const DST_ROLLEDUP_JS = await DST_ASSETS.get('rolledup.js')
    if (rollupExec.stdout !== '') console.log(chalk.grey(rollupExec.stdout.trim()))
    if (rollupExec.stderr !== '') console.log(chalk.grey(rollupExec.stderr.trim()))

    // Delete useless sourcemaps
    console.log(chalk.bold('\n🧹 Deleting source maps...\n'))
    const DST_INDEX_JS_MAP = dstAssetsFiles.find(file => file.name.match(/^index.[a-f0-9]{8}.js.map$/gm))
    const DST_VENDOR_JS_MAP = dstAssetsFiles.find(file => file.name.match(/^vendor.[a-f0-9]{8}.js.map$/gm))
    await DST_INDEX_JS_MAP.deleteSelfQuiet()
    await DST_VENDOR_JS_MAP.deleteSelfQuiet()
    console.log(chalk.grey('deleted.'))

    // Add build info into rolledup.js
    console.log(chalk.bold(`\n✍️  Storing build info into rolledup.js and ${DST_INDEX_CSS.name}...\n`))
    const buildComment = '/*\n'
      + `  version:  ${doVersionAndCommit ? `${versionName}` : '-'}\n`
      + `  branch:   ${branch}\n`
      + `  time:     ${buildTime.toISOString()}\n`
      + `  vendorJs: ${DST_VENDOR_JS.name}\n`
      + `  indexJs:  ${DST_INDEX_JS.name}\n`
      + `  indexCss: ${DST_INDEX_CSS.name}\n`
      + '*/\n'
    const buildVariable = `!function(){window.LM_APP_BUILD={version:'${versionName}',branch:'${branch}',time:'${buildTime.toISOString()}',vendorJs:'${DST_VENDOR_JS.name}',indexJs:'${DST_INDEX_JS.name}',indexCss:'${DST_INDEX_CSS.name}'}}();\n`
    await DST_ROLLEDUP_JS.editQuiet(content => (buildComment + buildVariable + content))
    await DST_INDEX_CSS.editQuiet(content => (buildComment + content))
    console.log(chalk.grey(buildComment.trim()))

    // Create latest and live versions
    if (doVersionAndCommit) console.log(chalk.bold(`\n👭 Creating index.${versionName}.js, index.${versionName}.css, index.latest.js and index.latest.css...\n`))
    else console.log(chalk.bold(`\n👭 Creating index.latest.js and index.latest.css...\n`))
    await DST_ROLLEDUP_JS.moveTo('index.latest.js')
    await DST_INDEX_CSS.copyTo('index.latest.css')
    if (doVersionAndCommit) await DST_ROLLEDUP_JS.copyTo(`index.${versionName}.js`)
    if (doVersionAndCommit) await DST_INDEX_CSS.copyTo(`index.${versionName}.css`)
    console.log(chalk.grey('created.'))
    if (linkToLive) {
      console.log(chalk.bold(`\n📺 Creating index.live.js and index.live.css...\n`))
      await DST_ROLLEDUP_JS.copyTo('index.live.js')
      await DST_INDEX_CSS.copyTo('index.live.css')
      console.log(chalk.grey('created.'))
    }

    // Link index.html to index.live.js and index.live.css
    console.log(chalk.bold(`\n🔗 Linking index.html to index.live.js and index.live.css...\n`))
    const DST_INDEX = await DST.get('index.html')
    await DST_INDEX.editHTMLQuiet(jsdom => {
      const documentElement = jsdom.window.document.documentElement
      const indexJsTags = documentElement.querySelectorAll(`script[src*="${DST_INDEX_JS.name}"], link[href*="${DST_INDEX_JS.name}"]`)
      const vendorJsTags = documentElement.querySelectorAll(`script[src*="${DST_VENDOR_JS.name}"], link[href*="${DST_VENDOR_JS.name}"]`)
      const indexCssTags = documentElement.querySelectorAll(`link[href*="${DST_INDEX_CSS.name}"]`)
      indexJsTags.forEach(tag => {
        jsdom.window.document.body.innerHTML += '\n<script'
          + ' async'
          + ' type="text/javascript"'
          + ` src="/lm-assets-for-vite-build/index.live.js"></script>`
        tag.remove()
      })
      vendorJsTags.forEach(tag => tag.remove())
      indexCssTags.forEach(tag => {
        jsdom.window.document.body.innerHTML += '\n<link'
          + ' rel="stylesheet"'
          + ` href="/lm-assets-for-vite-build/index.live.css"`
          + ' media="print"'
          + ' onload="this.media=\'all\'; this.onload=null;">'
        tag.remove()
      })
      return jsdom
    })
    console.log(chalk.grey('linked.'))

    // Relink all assets to assets_root_url
    console.log(chalk.bold(`\n🔗 Relinking assets to assets_root_url...\n`))
    const CONFIG_JSON = await ROOT.get('config.json')
    const config = JSON.parse(await CONFIG_JSON.read())
    const assetsRootUrl = config.assets_root_url
    const noTrailingSlashAssetsRootUrl = assetsRootUrl.replace(/\/$/, '')
    const replacement = noTrailingSlashAssetsRootUrl !== '' ? noTrailingSlashAssetsRootUrl + '/' : './assets/'
    const assetsDirName = '/lm-assets-for-vite-build/'
    const staticsDirName = './static/app/scripts/'
    const regexp = new RegExp(`(${assetsDirName}|${staticsDirName})`, 'gm')
    const assetsReplacer = content => content.replace(regexp, replacement)
    await DST_INDEX.editQuiet(assetsReplacer)
    await DST_ROLLEDUP_JS.editQuiet(assetsReplacer)
    await DST_INDEX_CSS.editQuiet(assetsReplacer)
    console.log(chalk.grey('relinked.'))

    // Prettify index.html
    console.log(chalk.bold('\n💅  Prettifying index.html...\n'))
    await DST_INDEX.prettifyHTMLQuiet()
    console.log(chalk.grey('prettified.'))

    // Create production, staging and testing outputs
    console.log(chalk.bold('\n📦 Creating production, staging, and testing outputs...\n'))
    await DST.mkdir('production')
    await DST.mkdir('staging')
    await DST.mkdir('testing')
    const DST_PRODUCTION_INDEX_HTML = await DST.copy('index.html', 'production/index.html')
    const DST_STAGING_INDEX_HTML = await DST.copy('index.html', 'staging/index.html')
    const DST_TESTING_INDEX_HTML = await DST.copy('index.html', 'testing/index.html')
    await DST_PRODUCTION_INDEX_HTML.prettifyHTMLQuiet()
    await DST_STAGING_INDEX_HTML.prettifyHTMLQuiet()
    await DST_TESTING_INDEX_HTML.prettifyHTMLQuiet()
    const envEditorFunc = (jsdom, env) => {
      const document = jsdom.window.document
      const documentElement = document.documentElement
      const preConfig = documentElement.querySelector('#lm-app-config')
      const strConfig = JSON.stringify({ ...config, env }, null, 2).replace(/\n/gm, '\n    ')
      preConfig.innerHTML = strConfig
      return jsdom
    }
    await DST_PRODUCTION_INDEX_HTML.editHTMLQuiet(jsdom => envEditorFunc(jsdom, 'production'))
    await DST_STAGING_INDEX_HTML.editHTMLQuiet(jsdom => envEditorFunc(jsdom, 'staging'))
    await DST_TESTING_INDEX_HTML.editHTMLQuiet(jsdom => envEditorFunc(jsdom, 'testing'))
    await DST_INDEX.deleteSelfQuiet()
    await DST_ASSETS.moveTo('assets')
    console.log(chalk.grey('created.'))

    // Delete .build/source, move .build/destination to build, and delete .build
    console.log(chalk.bold('\n📥 Outputting to /build...\n'))
    let DOT_BUILD = await ROOT.get('.build')
    let BUILD = await ROOT.get('build')
    let SOURCE = await DOT_BUILD.get('source')
    let DEST = await DOT_BUILD.get('destination')
    await SOURCE.deleteSelfQuiet()
    if (BUILD !== undefined) await BUILD.deleteSelfQuiet()
    await DEST.moveTo('../build')
    await DOT_BUILD.deleteSelfQuiet()
    console.log(chalk.grey('outputted.'))

    // Remove all .DS_Store files in build
    console.log(chalk.bold('\n🧹 Removing all .DS_Store files...\n'))
    await exec(`cd ${BUILD.path} && find . -name ".DS_Store" -print -delete && cd ${ROOT.path}`)
    console.log(chalk.grey('removed.'))

    // Zip outputs
    console.log(chalk.bold('\n🤐 Zipping outputs...\n'))
    const PRODUCTION = await BUILD.get('production')
    const STAGING = await BUILD.get('staging')
    const TESTING = await BUILD.get('testing')
    await zipDir(PRODUCTION.path, { saveTo: `${PRODUCTION.path}.zip` })
    await zipDir(STAGING.path, { saveTo: `${STAGING.path}.zip` })
    await zipDir(TESTING.path, { saveTo: `${TESTING.path}.zip` })
    console.log(chalk.grey('zipped.'))

    // Write build info to builds.json
    if (doVersionAndCommit) {
      console.log(chalk.bold('\n✍️  Storing build info to builds.json...\n'))
      await BUILDS_JSON.editQuiet(content => {
        const parsed = JSON.parse(content)
        if (parsed[branch] === undefined) parsed[branch] = []
        const branchData = parsed[branch]
        const newBuildData = {
          version: targetBuildVersion,
          description: buildDescription,
          time: buildTime
        }
        branchData.push(newBuildData)
        const returned = JSON.stringify(parsed, null, 2)
        return returned
      })
      console.log(chalk.grey('stored.'))
    }

    // Commit and push to Github
    if (doVersionAndCommit) {
      console.log(chalk.bold('\n📣 Commiting and pushing to Github...'))
      await exec('git add -u')
      await exec(`git commit -m "BUILD - ${buildVersionNameWithDesc}"`)
      const pushResult = await exec(`git push origin ${branch}`)
      console.log(chalk.grey(`\nPushed: BUILD - ${buildVersionNameWithDesc}`))
      if (pushResult.stdout !== '') console.log(`${chalk.grey(pushResult.stdout.trim())}`)
      if (pushResult.stderr !== '') console.log(`${chalk.grey(pushResult.stderr.trim())}`)
    }

    // The end.
    console.log(chalk.bold('\n🍸 That\'s all good my friend!\n'))

  } catch (err) {
    await cleanup('CAUGHT')
    console.log()
    if (err instanceof Error) {
      console.log(chalk.bold.red(err.message))
      console.log(chalk.bold.red(err.stack))
    } else {
      console.log(chalk.bold.red('Something went wrong:'))
      console.log(err)
    }
    console.log(chalk.bold.red('Process aborted.'))
    console.log()
  }
}

let isCleaningUp = false
async function cleanup (reason) {
  if (isCleaningUp) return
  console.log(chalk.bold(`\n🧹 Cleaning up before exit on ${reason}...\n`))
  isCleaningUp = true
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const ROOT = new Directory(path.join(__dirname, '../'))
  const TEMP_BUILD_DIR = await ROOT.get('.build')
  if (TEMP_BUILD_DIR !== undefined) await TEMP_BUILD_DIR.deleteSelfQuiet()
  console.log(chalk.grey('cleaned up.'))
}
