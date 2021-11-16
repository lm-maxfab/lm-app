import { Directory } from './modules/file-system/index.mjs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import exec from './modules/exec-promise/index.mjs'
import {
  latestVersionIn,
  promptTargetVersionFrom,
  versionToString,
  initialVersion
} from './modules/versionning/index.mjs'
import prompts from 'prompts'

async function build () {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const ROOT = new Directory(path.join(__dirname, '../'))

  try {
    // Get versionning info
    const BUILDS_JSON = await ROOT.get('builds.json')
    const allBuilds = JSON.parse(await BUILDS_JSON.read())
    const branch = (await exec('git branch --show-current')).stdout.trim()
    const builds = allBuilds[branch] ?? []
    const latestBuildVersion = latestVersionIn(builds) ?? initialVersion
    const targetBuildVersion = await promptTargetVersionFrom(latestBuildVersion)
    const versionName = versionToString(targetBuildVersion)
    const buildTime = new Date()

    const promptsVersionDescriptionOptions = {
      type: 'text',
      name: 'description',
      message: 'Description of the build version:'
    }
    const buildDescription = (await prompts(promptsVersionDescriptionOptions)).description

    // Commit everything
    await exec('git add -u')
    const gitStatus = await exec('git status')
    console.log(gitStatus.stdout)
    const readyToPush = (await prompts({
      type: 'confirm',
      name: 'push',
      message: 'Do you want to commit and push as is or abort ?'
    })).push
    if (!readyToPush) {
      await exec('git reset')
      throw new Error('Build process needs to commit and push every changes in the current branch.')
    }
    await exec(`git commit -m "BUILD - ${versionName} - ${buildDescription}"`)
    const pushResult = await exec(`git push origin ${branch}`)
    console.log(pushResult)
    console.log('lol')

    // // Move all buildable to .build
    // if ((await ROOT.get('.build') === undefined)) await ROOT.mkdir('.build')
    // else await ROOT.emptyQuiet('.build')
    // await ROOT.mkdir('.build/source')
    // const SRC_INDEX = await ROOT.copy('index.html', '.build/source/index.html')
    // await SRC_INDEX.editHTMLQuiet(jsdom => {
    //   const documentElement = jsdom.window.document.documentElement
    //   const $deleteAtBuild = documentElement.querySelectorAll('.delete-at-build')
    //   $deleteAtBuild.forEach(elt => elt.remove())
    //   return jsdom
    // })
    // await ROOT.copy('src', '.build/source/src')
    // await ROOT.copy('static', '.build/source/static')

    // // Build
    // await exec('tsc && vite build')

    // // Bundle vendor and index js into a single iife
    // const DST = await ROOT.get('.build/destination')
    // const DST_ASSETS = await DST.get('lm-assets-for-vite-build')
    // const dstAssetsFiles = await DST_ASSETS.list()
    // const DST_INDEX_JS = dstAssetsFiles.find(file => file.name.match(/^index.[a-f0-9]{8}.js$/gm))
    // await exec(`npx rollup -i ${DST_INDEX_JS.path} -o ${path.join(DST_ASSETS.path, 'rolledup.js')} -f iife`)

    // // Delete useless vendor.<hash>.js, index.<hash>.js and their sourcemaps
    // const DST_INDEX_JS_MAP = dstAssetsFiles.find(file => file.name.match(/^index.[a-f0-9]{8}.js.map$/gm))
    // const DST_VENDOR_JS = dstAssetsFiles.find(file => file.name.match(/^vendor.[a-f0-9]{8}.js$/gm))
    // const DST_VENDOR_JS_MAP = dstAssetsFiles.find(file => file.name.match(/^vendor.[a-f0-9]{8}.js.map$/gm))
    // const DST_INDEX_CSS = dstAssetsFiles.find(file => file.name.match(/^index.[a-f0-9]{8}.css$/gm))
    // const dstIndexJsName = DST_INDEX_JS.name
    // const dstVendorJsName = DST_VENDOR_JS.name
    // const dstIndexCssName = DST_INDEX_CSS.name
    // await DST_INDEX_JS.deleteSelfQuiet()
    // await DST_INDEX_JS_MAP.deleteSelfQuiet()
    // await DST_VENDOR_JS.deleteSelfQuiet()
    // await DST_VENDOR_JS_MAP.deleteSelfQuiet()

    // // Add build info into index.<version>.js
    // const DST_FINAL_JS = await DST_ASSETS.get('rolledup.js')
    // await DST_FINAL_JS.editQuiet(content => {
    //   const buildInfo = 'window.LM_APP_GLOBALS.build = {\n'
    //     + `  version: '${versionName}',\n`
    //     + `  branch: '${branch}',\n`
    //     + `  time: '${buildTime.toISOString()}'\n`
    //     + '}\n'
    //   return buildInfo + content
    // })

    // // Create latest and live versions
    // await DST_FINAL_JS.moveTo(`index.${versionName}.js`)
    // await DST_INDEX_CSS.moveTo(`index.${versionName}.css`)
    // await DST_FINAL_JS.copyTo('index.latest.js')
    // await DST_INDEX_CSS.copyTo('index.latest.css')
    // const linkToLive = (await prompts({
    //   type: 'confirm',
    //   name: 'response',
    //   message: 'Do you want this version to be live?'
    // })).response
    // if (linkToLive) {
    //   await DST_FINAL_JS.copyTo('index.live.js')
    //   await DST_INDEX_CSS.copyTo('index.live.css')
    // }

    // // Link js and css to index.html
    // const DST_INDEX = await DST.get('index.html')
    // await DST_INDEX.editHTMLQuiet(jsdom => {
    //   const documentElement = jsdom.window.document.documentElement
    //   const indexJsTags = documentElement.querySelectorAll(`script[src*="${dstIndexJsName}"], link[href*="${dstIndexJsName}"]`)
    //   const vendorJsTags = documentElement.querySelectorAll(`script[src*="${dstVendorJsName}"], link[href*="${dstVendorJsName}"]`)
    //   const indexCssTags = documentElement.querySelectorAll(`link[href*="${dstIndexCssName}"]`)
    //   indexJsTags.forEach(tag => {
    //     jsdom.window.document.body.innerHTML += '\n<script'
    //       + ' id="lm-app-main-script"'
    //       + ' type="text/javascript"'
    //       + ' defer'
    //       + ` src="/lm-assets-for-vite-build/${DST_FINAL_JS.name}"></script>`
    //     tag.remove()
    //   })
    //   vendorJsTags.forEach(tag => tag.remove())
    //   indexCssTags.forEach(tag => {
    //     jsdom.window.document.body.innerHTML += '\n<link'
    //       + ' id="lm-app-styles"'
    //       + ' rel="stylesheet"'
    //       + ` href="/lm-assets-for-vite-build/${DST_INDEX_CSS.name}"`
    //       + ' media="print"'
    //       + ' onload="this.media=\'all\'; this.onload=null;">'
    //     tag.remove()
    //   })
    //   return jsdom
    // })

    // // Relink assets to assets_root_url
    // const dstIndexJsdom = await DST_INDEX.readHTML()
    // const dstIndexJsdomDocument = dstIndexJsdom.window.document
    // const dstIndexGlobalsScript = dstIndexJsdomDocument.documentElement.querySelector('#lm-app-globals-script')
    // const dstIndexGlobalsScriptLines = dstIndexGlobalsScript.innerHTML.split('\n')
    // const assetsRootUrl = dstIndexGlobalsScriptLines
    //   .find(line => line.match('.assets_root_url'))
    //   .split('=')
    //   .slice(-1)[0]
    //   .trim()
    //   .replace(/^'/, '')
    //   .replace(/'$/, '')
    //   .replace(/\/$/gm, '') + '/'
    // if (assetsRootUrl !== '') {
    //   await DST_INDEX.editQuiet(content => content.replace(/\/lm-assets-for-vite-build\//gm, assetsRootUrl))
    //   await DST_FINAL_JS.editQuiet(content => content.replace(/\/lm-assets-for-vite-build\//gm, assetsRootUrl))
    //   await DST_INDEX_CSS.editQuiet(content => content.replace(/\/lm-assets-for-vite-build\//gm, assetsRootUrl))
    // }

    // // Prettify index.html
    // await DST_INDEX.prettifyHTMLQuiet()

    // // Create production, staging and testing outputs
    // await DST.mkdir('production')
    // await DST.mkdir('staging')
    // await DST.mkdir('testing')
    // const DST_PRODUCTION_INDEX_HTML = await DST.copy('index.html', 'production/index.html')
    // const DST_STAGING_INDEX_HTML = await DST.copy('index.html', 'staging/index.html')
    // const DST_TESTING_INDEX_HTML = await DST.copy('index.html', 'testing/index.html')
    // await DST_PRODUCTION_INDEX_HTML.editHTMLQuiet(jsdom => {
    //   const document = jsdom.window.document
    //   const documentElement = document.documentElement
    //   const globalsScript = documentElement.querySelector('#lm-app-globals-script')
    //   globalsScript.innerHTML += `  window.LM_APP_GLOBALS.env = 'production'\n`
    //   return jsdom
    // })
    // await DST_PRODUCTION_INDEX_HTML.prettifyHTMLQuiet()
    // await DST_STAGING_INDEX_HTML.editHTMLQuiet(jsdom => {
    //   const document = jsdom.window.document
    //   const documentElement = document.documentElement
    //   const globalsScript = documentElement.querySelector('#lm-app-globals-script')
    //   globalsScript.innerHTML += `  window.LM_APP_GLOBALS.env = 'staging'\n`
    //   return jsdom
    // })
    // await DST_STAGING_INDEX_HTML.prettifyHTMLQuiet()
    // await DST_TESTING_INDEX_HTML.editHTMLQuiet(jsdom => {
    //   const document = jsdom.window.document
    //   const documentElement = document.documentElement
    //   const globalsScript = documentElement.querySelector('#lm-app-globals-script')
    //   globalsScript.innerHTML += `  window.LM_APP_GLOBALS.env = 'testing'\n`
    //   return jsdom
    // })
    // await DST_TESTING_INDEX_HTML.prettifyHTMLQuiet()

    // // Rename destination assets directory for convenience
    // await DST_ASSETS.moveTo('assets')

    // Write build info
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


  } catch (err) {
    console.log()
    if (err instanceof Error) console.log(err.message)
    else {
      console.log('Something went wrong:')
      console.log(err)
    }
    const TEMP_BUILD_DIR = await ROOT.get('.build')
    if (TEMP_BUILD_DIR !== undefined) await TEMP_BUILD_DIR.deleteSelfQuiet()
    console.log('Process aborted.')
    console.log()
  }
}

build ()
