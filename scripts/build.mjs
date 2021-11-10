import { Directory } from './modules/file-system/index.mjs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import exec from './modules/exec-promise/index.mjs'
import pretty from 'pretty'
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

  // Get versionning info
  const BUILDS_JSON = await ROOT.get('builds.json')
  const allBuilds = JSON.parse(await BUILDS_JSON.read())
  const branch = (await exec('git branch --show-current')).stdout.trim()
  const builds = allBuilds[branch] ?? []
  const latestBuildVersion = latestVersionIn(builds) ?? initialVersion
  const targetBuildVersion = await promptTargetVersionFrom(latestBuildVersion)
  const versionName = versionToString(targetBuildVersion)

  // Move all buildable to .build
  await ROOT.empty('.build')
  await ROOT.mkdir('.build/source')
  const SRC_INDEX = await ROOT.copy('index.html', '.build/source/index.html')
  await SRC_INDEX.editHTML(jsdom => {
    const documentElement = jsdom.window.document.documentElement
    const $deleteAtBuild = documentElement.querySelectorAll('.delete-at-build')
    $deleteAtBuild.forEach(elt => elt.remove())
    return jsdom
  })
  await ROOT.copy('src', '.build/source/src')
  await ROOT.copy('static', '.build/source/static')

  // Build
  await exec('tsc && vite build')

  // Rollup Vite output
  const DST = await ROOT.get('.build/destination')
  const DST_ASSETS = await DST.get('lm-assets-for-vite-build')
  const dstAssetsFiles = await DST_ASSETS.list()
  const DST_INDEX_JS = dstAssetsFiles.find(file => file.name.match(/^index.[a-f0-9]{8}.js$/gm))
  const DST_INDEX_JS_MAP = dstAssetsFiles.find(file => file.name.match(/^index.[a-f0-9]{8}.js.map$/gm))
  const DST_VENDOR_JS = dstAssetsFiles.find(file => file.name.match(/^vendor.[a-f0-9]{8}.js$/gm))
  const DST_VENDOR_JS_MAP = dstAssetsFiles.find(file => file.name.match(/^vendor.[a-f0-9]{8}.js.map$/gm))
  const DST_INDEX_CSS = dstAssetsFiles.find(file => file.name.match(/^index.[a-f0-9]{8}.css$/gm))
  await exec(`npx rollup -i ${DST_INDEX_JS.path} -o ${path.join(DST_ASSETS.path, 'rolledup.js')} -f iife`)
  const dstIndexJsName = DST_INDEX_JS.name
  const dstVendorJsName = DST_VENDOR_JS.name
  const dstIndexCssName = DST_INDEX_CSS.name
  await DST_INDEX_JS.deleteSelf()
  await DST_INDEX_JS_MAP.deleteSelf()
  await DST_VENDOR_JS.deleteSelf()
  await DST_VENDOR_JS_MAP.deleteSelf()
  const DST_FINAL_JS = await DST_ASSETS.get('rolledup.js')
  await DST_FINAL_JS.moveTo(`index.${versionName}.js`)
  await DST_INDEX_CSS.moveTo(`index.${versionName}.css`)
  const DST_INDEX = await DST.get('index.html')
  await DST_INDEX.editHTML(jsdom => {
    const documentElement = jsdom.window.document.documentElement
    const indexJsTags = documentElement.querySelectorAll(`script[src*="${dstIndexJsName}"], link[href*="${dstIndexJsName}"]`)
    const vendorJsTags = documentElement.querySelectorAll(`script[src*="${dstVendorJsName}"], link[href*="${dstVendorJsName}"]`)
    const indexCssTags = documentElement.querySelectorAll(`link[href*="${dstIndexCssName}"]`)
    indexJsTags.forEach(tag => {
      jsdom.window.document.body.innerHTML += '\n<script'
        + ' type="text/javascript"'
        + ' defer'
        + ` src="/lm-assets-for-vite-build/${DST_FINAL_JS.name}"></script>`
      tag.remove()
    })
    vendorJsTags.forEach(tag => tag.remove())
    indexCssTags.forEach(tag => {
      jsdom.window.document.body.innerHTML += '\n<link'
        + ' rel="stylesheet"'
        + ` href="/lm-assets-for-vite-build/${DST_INDEX_CSS.name}"`
        + ' media="print"'
        + ' onload="this.media=\'all\'; this.onload=null;">'
      tag.remove()
    })
    return jsdom
  })
  await DST_INDEX.edit(content => {
    // [WIP] Add version in comment at top and in globals
    const lines = content.split('\n')
    const noWhiteLines = lines.filter(line => line.trim() !== '')
    const noIndentLines = noWhiteLines.map(line => line.trim())
    const prettified = pretty(noIndentLines.join('\n'), { ocd: true })
    return prettified + '\n'
  })

  // Relink assets
  const SRC_SRC_CONFIG_JSON = await ROOT.get('.build/source/src/config.json')
  const config = JSON.parse((await SRC_SRC_CONFIG_JSON.read()))
  const assetsRootUrl = config.assets_root_url.replace(/\/$/gm, '') + '/'
  if (assetsRootUrl !== '') {
    await DST_INDEX.edit(content => content.replace(/\/lm-assets-for-vite-build\//gm, assetsRootUrl))
    await DST_FINAL_JS.edit(content => content.replace(/\/lm-assets-for-vite-build\//gm, assetsRootUrl))
    await DST_INDEX_CSS.edit(content => content.replace(/\/lm-assets-for-vite-build\//gm, assetsRootUrl))
  }

  // Create "latest" named sources
  await DST_FINAL_JS.copyTo('index.latest.js')
  await DST_INDEX_CSS.copyTo('index.latest.css')

  // Link output to production
  const linkIt = (await prompts({
    type: 'confirm',
    name: 'link',
    message: 'Do you want this version to be live?'
  })).link
  if (linkIt) {
    await DST_FINAL_JS.copyTo('index.live.js')
    await DST_INDEX_CSS.copyTo('index.live.css')
  }

  // Rename destination assets directory for convenience
  await DST_ASSETS.moveTo('assets')

}

build ()
