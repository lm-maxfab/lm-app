/* eslint-disable no-template-curly-in-string */
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import moment from 'moment'
import {
  cmd,
  laxcmd,
  updatePreload,
  lint,
  checkGitStatus,
  handleGitStatus,
  copySourceToTemp,
  stripDevElementsInIndex,
  buildFromTemp,
  deleteTemp,
  rollupIndexAndVendor,
  removeSourceMaps,
  removeVendor,
  editFile,
  editHtml,
  confirm,
  prettifyHtml
} from './_utils.mjs'

const rawConfigJson = readFileSync('src/config.json', { encoding: 'utf8' })
const config = JSON.parse(rawConfigJson)
const { assets_root_url } = config

build()

async function build () {

  try {
    // await updatePreload()
    // await lint()
    // const gitStatus = await checkGitStatus()
    // const gitStatusIsClean = await handleGitStatus(gitStatus)
    await copySourceToTemp()
    await stripDevElementsInIndex()
    await buildFromTemp()
    await deleteTemp()
    await rollupIndexAndVendor()
    await removeSourceMaps()
    await removeVendor()
    
    // // Remove index.[hash].js.map, vendor.[hash].js and vendor.[hash].js.map
    // const indexJsMapFileName = assetsFilesList.find(name => name.match(/^index.[a-f0-9]{8}.js.map$/))
    // const indexJsMapFilePath = join(assetsFilesPath, indexJsMapFileName)
    // const vendorJsFileName = assetsFilesList.find(name => name.match(/^vendor.[a-f0-9]{8}.js$/))
    // const vendorJsFilePath = join(assetsFilesPath, vendorJsFileName)
    // const vendorJsMapFileName = assetsFilesList.find(name => name.match(/^vendor.[a-f0-9]{8}.js.map$/))
    // const vendorJsMapFilePath = join(assetsFilesPath, vendorJsMapFileName)
    // await cmd(`rm -rf ${indexJsMapFilePath} ${vendorJsFilePath} ${vendorJsMapFilePath}`)

    // // Replace scripts in index.html
    // const buildIndexHtmlFilePath = join(pwd, 'build/index.html')
    // await editHtml(buildIndexHtmlFilePath, $document => {
    //   $document.querySelector('link[rel="modulepreload"]').remove() // remove vendor.hash.js
    //   const $indexJsLink = $document.querySelector('script[type="module"]')
    //   $indexJsLink.removeAttribute('type') // remove type="module" from index.hash.js
    //   $document.body.append($indexJsLink)
    //   return $document
    // }, false)

    // // Relink assets in index.html via assets_root_url
    // if (assets_root_url !== null) {
    //   await editHtml(buildIndexHtmlFilePath, $document => {
    //     const $links = $document.querySelectorAll('link')
    //     const $scripts = $document.querySelectorAll('script')
    //     $links.forEach($link => {
    //       const href = $link.getAttribute('href')
    //       if (href.match(/^\/assets/)) {
    //         const newHref = href.replace(/^\/assets/, assets_root_url)
    //         $link.setAttribute('href', newHref)
    //       }
    //     })
    //     $scripts.forEach($script => {
    //       const src = $script.getAttribute('src')
    //       if (src.match(/^\/assets/)) {
    //         const newSrc = src.replace(/^\/assets/, assets_root_url)
    //         $script.setAttribute('src', newSrc)
    //       }
    //     })
    //     return $document
    //   }, false)
    // }

    // // Relink assets in index.[hash].js via assets_root_url
    // if (assets_root_url !== null) {
    //   await editFile(indexJsFilePath, contents => {
    //     return contents.replace(/\/assets\//gm, `${assets_root_url}/`)
    //   }, false)
    // }

    // // Relink assets in index.[hash].css via assets_root_url
    // if (assets_root_url !== null) {
    //   const indexHashCssFileName = assetsFilesList.find(name => name.match(/^index.[a-f0-9]{8}.css$/))
    //   const indexHashCssFilePath = join(assetsFilesPath, indexHashCssFileName)
    //   await editFile(indexHashCssFilePath, contents => {
    //     return contents.replace(/\/assets\//gm, `${assets_root_url}/`)
    //   }, false)
    // }

    // /* * * * * * * * * * * * * * * * * * * *
    //  *
    //  * BUILD INFO
    //  * 
    //  * * * * * * * * * * * * * * * * * * * */ 

    // // Store build info inside build/index.html
    // await cmd('echo "\n✍️  $(tput bold)Storing build info...$(tput sgr0)\n"')
    // await editHtml(buildIndexHtmlFilePath, async ($document) => {
    //   const now = moment().toString()
    //   const currentBranch = await cmd('git rev-parse --abbrev-ref HEAD', false)
    //   const currentCommit = await cmd('git show --oneline -s', false)
    //   const $buildInfoNode = $document.createElement('span')
    //   $buildInfoNode.setAttribute('id', 'lm-app-build-info')
    //   $buildInfoNode.style.display = 'none'
    //   $buildInfoNode.style.fontSize = '0px'
    //   $buildInfoNode.style.lineHeight = '0px'
    //   $buildInfoNode.style.color = 'transparent'
    //   $buildInfoNode.innerHTML += '\n      <p>BUILD INFO</p>'
    //   $buildInfoNode.innerHTML += '\n      <p>==========</p>'
    //   $buildInfoNode.innerHTML += `\n      <p>Time: ${now}</p>`
    //   $buildInfoNode.innerHTML += '\n      <p>Repo: https://github.com/lm-maxfab/lm-app</p>'
    //   $buildInfoNode.innerHTML += `\n      <p>Branch: ${currentBranch.trim()}</p>`
    //   $buildInfoNode.innerHTML += `\n      <p>Commit: ${currentCommit.trim()}</p>`
    //   if (assets_root_url) $buildInfoNode.innerHTML += `\n      <p>Assets: ${assets_root_url}</p>`
    //   if (!gitStatusIsClean) $buildInfoNode.innerHTML += '\n      <p>Built with some uncommited changes.</p>'
    //   $document.body.prepend($buildInfoNode)
    //   return $document
    // }, false)

    // /* * * * * * * * * * * * * * * * * * * *
    //  *
    //  * PRETTIFY
    //  * 
    //  * * * * * * * * * * * * * * * * * * * */

    // await editFile(buildIndexHtmlFilePath, contents => {
    //   const lines = contents.split('\n')
    //   const noBlankLines = lines.filter(line => line.trim() !== '')
    //   return noBlankLines.join('\n')
    // }, false)
    // await prettifyHtml(buildIndexHtmlFilePath, false)
    // await editFile(buildIndexHtmlFilePath, contents => {
    //   const lines = contents.split('\n')
    //   const newLines = lines.map((line, i) => {
    //     if (line.match(/><head>/)) return line.replace(/><head>/, '>\n  <head>')
    //     else if (line.match(/<body><span/)) return line.replace(/<body><span/, '<body>\n    <span')
    //     else if (line.match(/<\/p><\/span>/)) return line.replace(/<\/p><\/span>/, '</p>\n    </span>')
    //     else if (line.match(/<\/body><\/html>/)) return line.replace(/<\/body><\/html>/, '  </body>\n</html>\n')
    //     return line
    //   }).filter(line => line.trim() !== '')
    //   return newLines.join('\n')
    // }, false)

    // /* * * * * * * * * * * * * * * * * * * *
    //  *
    //  * DS_STORES REMOVAL
    //  * 
    //  * * * * * * * * * * * * * * * * * * * */ 

    // // Remove development files & statics
    // await cmd('echo "\n🧽 $(tput bold)Removing all .DS_Store, asset-manifest.json, development statics...$(tput sgr0)\n"')
    // await cmd('touch build/.DS_Store')
    // await cmd('find . -name ".DS_Store" -print -delete')

    // /* * * * * * * * * * * * * * * * * * * *
    //  *
    //  * LONGFORM & SNIPPET BUILDS
    //  * 
    //  * * * * * * * * * * * * * * * * * * * */ 

    // // Create longform and snippet builds
    // await cmd('echo "\n🎁 $(tput bold)Creating longform and snippet builds...$(tput sgr0)\n"')
    // await cmd('mkdir -p build/longform build/snippet')
    // await cmd('mv build/index.html build/longform/index.html')
    // await cmd('cp -r build/assets build/longform/assets')
    // await cmd('cp build/longform/index.html build/snippet/index.html')
    // await cmd('cp -r build/longform/assets build/snippet/assets')
    // await cmd('echo "./build → ./build/longform\n./build → ./build/snippet"')

    // // Zip the longform build
    // await cmd('echo "\n🤐 $(tput bold)Zipping the longform build...$(tput sgr0)\n"')
    // await cmd('cd build && zip -r longform.zip longform && cd ../')

    // // Snippet is only body content
    // const snippetIndexHtmlFilePath = join(pwd, 'build/snippet/index.html')
    // await editFile(snippetIndexHtmlFilePath, content => {
    //   const lines = content.split('\n')
    //   const linkLine = lines.find(line => line.match(/<link rel="stylesheet"/))
    //   const bodyStartLine = lines.findIndex(line => line.match(/<body>/))
    //   const bodyEndLine = lines.findIndex(line => line.match(/<\/body>/))
    //   const bodyLines = lines.slice(bodyStartLine + 1, bodyEndLine)
    //   const outLines = [linkLine, ...bodyLines].map(line => line.replace(/^\s{4}/, ''))
    //   return outLines.join('\n')
    // }, false)

    // /* * * * * * * * * * * * * * * * * * * *
    //  *
    //  * END
    //  * 
    //  * * * * * * * * * * * * * * * * * * * */ 

    // // Done
    // await cmd(`echo "\n🍸 $(tput bold)That\'s all good my friend!$(tput sgr0)\n" &&
    //   echo "If you\'re building a longform, just take the zip and upload it." &&
    //   echo "If you\'re building a snippet, dont forget to upload statics to the place you specified in /src/config.json/assets_root_url!" &&
    //   echo "Bye now."`)
  } catch (err) {
    console.log('\n', err)
    process.exit(1)
  }
}

export default build
