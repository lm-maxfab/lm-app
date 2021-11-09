import fse from 'fs-extra'
import { exec, execSync } from 'child_process'
import { Directory, File } from './modules/file-system/index.mjs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { JSDOM } from 'jsdom'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = new Directory(path.join(__dirname, '../'))

build ()

async function build () {
  // Move all buildable to .temp-build
  
  // let tempBuildExists = (await ROOT.get('.build')) !== undefined
  // if (tempBuildExists) await ROOT.emptyChild('.build')
  // await ROOT.mkdir('.build', 'source')
  await ROOT.mkdir('.build', 'some', 'path', 'to', 'a', 'dir')

  
  
  
  // await fse.rm(tempBuildDirPath, { recursive: true, force: true })
  // await fse.mkdir(tempBuildDirPath)
  // await fse.mkdir(tempBuildSourceDirPath)
  
  // await fse.copy(indexHtmlPath, tempBuildSourceIndexHtmlPath)
  // await fse.copy(srcDirPath, tempBuildSourceSrcDirPath)
  // await fse.copy(staticDirPath, tempBuildSourceStaticDirPath)

  // // Strip all dev links
  // const tempBuildSourceIndexHtmlContent = await fse.readFile(tempBuildSourceIndexHtmlPath, { encoding: 'utf-8' })
  // const $tempBuildIndexHtml = new JSDOM(tempBuildSourceIndexHtmlContent)
  // const $toDeleteList = $tempBuildIndexHtml.window.document.querySelectorAll('.delete-at-build')
  // $toDeleteList.forEach($elt => $elt.remove())
  // const newTempBuildSourceIndexHtmlContent = $tempBuildIndexHtml.window.document.documentElement.outerHTML
  // await fse.writeFile(tempBuildIndexHtmlPath, newTempBuildSourceIndexHtmlContent, { encoding: 'utf-8' })

  // // Build
  // execSync('tsc && vite build')
}

// const ROOT = { path: path.join(__dirname, '../') }
// ROOT.INDEX_HTML = { path: path.join(ROOT.path, 'index.html') }


// const indexHtmlPath = path.join(__dirname, '../index.html')
// const srcDirPath = path.join(__dirname, '../src')
// const staticDirPath = path.join(__dirname, '../static')

// const tempBuildDirPath = path.join(__dirname, '../.temp-build')
// const tempBuildSourceDirPath = path.join(__dirname, '../.temp-build/source')
// const tempBuildSourceIndexHtmlPath = path.join(tempBuildSourceDirPath, 'index.html')
// const tempBuildSourceSrcDirPath = path.join(tempBuildSourceDirPath, 'src')
// const tempBuildSourceStaticDirPath = path.join(tempBuildSourceDirPath, 'static')

// const tempBuildDestDirPath = path.join(__dirname, '../.temp-build/dest')

// build ()

// async function build () {
//   // Move all buildable to .temp-build
//   await fse.rm(tempBuildDirPath, { recursive: true, force: true })
//   await fse.mkdir(tempBuildDirPath)
//   await fse.mkdir(tempBuildSourceDirPath)
  
//   await fse.copy(indexHtmlPath, tempBuildSourceIndexHtmlPath)
//   await fse.copy(srcDirPath, tempBuildSourceSrcDirPath)
//   await fse.copy(staticDirPath, tempBuildSourceStaticDirPath)

//   // Strip all dev links
//   const tempBuildSourceIndexHtmlContent = await fse.readFile(tempBuildSourceIndexHtmlPath, { encoding: 'utf-8' })
//   const $tempBuildIndexHtml = new JSDOM(tempBuildSourceIndexHtmlContent)
//   const $toDeleteList = $tempBuildIndexHtml.window.document.querySelectorAll('.delete-at-build')
//   $toDeleteList.forEach($elt => $elt.remove())
//   const newTempBuildSourceIndexHtmlContent = $tempBuildIndexHtml.window.document.documentElement.outerHTML
//   await fse.writeFile(tempBuildIndexHtmlPath, newTempBuildSourceIndexHtmlContent, { encoding: 'utf-8' })

//   // Build
//   execSync('tsc && vite build')
// }
