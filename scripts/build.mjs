import { Directory } from './modules/file-system/index.mjs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import exec from './modules/exec/index.mjs'

async function build () {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const ROOT = new Directory(path.join(__dirname, '../'))

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
  const DST_ASSETS = await DST.get('assets')
  const DST_ASSETS_files = await DST_ASSETS.list()
  const DST_VENDOR = DST_ASSETS_files.find(file => file.name.match(/^vendor.[a-f0-9]{8}.js$/gm))
  const DST_INDEX = DST_ASSETS_files.find(file => file.name.match(/^index.[a-f0-9]{8}.js$/gm))
  await exec(`npx rollup -i ${DST_INDEX.path} -o ${path.join(DST_ASSETS.path, 'rolledup.js')} -f iife`)

  const DST_ROLLEDUP = await DST_ASSETS.get('rolledup.js')
  console.log(DST_ROLLEDUP)
}

build ()
