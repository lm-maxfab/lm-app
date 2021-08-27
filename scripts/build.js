/* eslint-disable no-template-curly-in-string */

const { readFileSync, writeFileSync } = require('fs')
const path = require('path')
const jsdom = require('jsdom')
const pretty = require('pretty')
const prompt = require('async-prompt')
const { cmd, laxcmd, updatePreload } = require('./_utils')
const config = require('../src/config.json')

const { JSDOM } = jsdom

build()

async function build () {
  try {
    // // Update spreadsheet preload
    // await cmd('echo "\n⏬ $(tput bold)Updating spreadsheet preload...$(tput sgr0)\n"')
    // await updatePreload()
    // await cmd('echo "./src/preload.js"')

    // // Run standard.js
    // await cmd('echo "\n👀 $(tput bold)Linting...$(tput sgr0)\n"')
    // try {
    //   await cmd('npm run lint')
    // } catch (err) {
    //   console.log(err.stdout)
    //   const userInput = await prompt('Your code shows lint errors, do you want to continue ? (Y/N): ')
    //   if (!userInput.match(/^y$/i)) process.exit(1)
    // }

    // Check git status
    await cmd('echo "\n📡 $(tput bold)Checking git status...$(tput sgr0)\n"')
    const gitStatus = await cmd('git status')
    console.log(gitStatus.split('\n'))

    // // Remove previous build
    // await cmd('echo "\n🧹 $(tput bold)Removing previous build...$(tput sgr0)\n"')
    // await cmd('rm -rfv ./build ./build.zip')

    // // Build the app
    // await cmd('echo "\n🛠  $(tput bold)Building the app...$(tput sgr0)\n"')
    // await cmd('INLINE_RUNTIME_CHUNK=false GENERATE_SOURCEMAP=false SKIP_PREFLIGHT_CHECK=true react-scripts build')

    // // Relink the development statics to the production ones
    // await cmd('echo "\n🔗 $(tput bold)Relinking statics...$(tput sgr0)\n"')
    // const pwd = (await cmd('pwd', false)).trim()
    // const fontsCssFilePath = path.join(pwd, 'build/static/lm-app/styles/fonts.css')
    // const fontsCssContent = readFileSync(fontsCssFilePath, { encoding: 'utf8' })
    // const originalPath = /..\/..\/lemonde\/fonts/g
    // const replacedPath = 'https://lemonde.fr/dist/assets/fonts'
    // const replacedFontsCssContent = fontsCssContent.replace(originalPath, replacedPath)
    // writeFileSync(fontsCssFilePath, replacedFontsCssContent, { encoding: 'utf8' })
    // await cmd('echo "./build/static/lm-app/styles/fonts.css"')
    // const indexHtmlFilePath = path.join(pwd, 'build/index.html')
    // const indexHtmlContent = readFileSync(indexHtmlFilePath, { encoding: 'utf8' })
    // const indexHtmlDom = new JSDOM(indexHtmlContent)
    // const indexHtmlDomDocument = indexHtmlDom.window.document
    // const $indexHtmlLinks = [...indexHtmlDomDocument.querySelectorAll('link[rel=stylesheet]')]
    // $indexHtmlLinks.forEach($link => {
    //   const hrefAttr = $link.getAttribute('href')
    //   if (hrefAttr.match(/^.\/static\/lemonde/)) $link.remove()
    // })
    // const prettyReplacedIndexHtmlContent = pretty(indexHtmlDomDocument.documentElement.outerHTML)
    //   .split('\n')
    //   .filter(line => line !== '')
    //   .join('\n')
    //   .replace('<body>', '<body>\n    ')
    // const replacedIndexHtmlContent = `${prettyReplacedIndexHtmlContent}\n`
    // writeFileSync(indexHtmlFilePath, replacedIndexHtmlContent, { encoding: 'utf8' })
    // await cmd('echo "./build/index.html"')

    // // Remove development statics
    // await cmd('echo "\n🧽 $(tput bold)Removing all .DS_Store, asset-manifest.json, development statics...$(tput sgr0)\n"')
    // await cmd('touch build/.DS_Store')
    // await cmd('find . -name ".DS_Store" -print -delete')
    // await cmd('rm -rfv ./build/asset-manifest.json')
    // await cmd('rm -rfv ./build/static/lemonde')

    // // Create longform and snippet folders
    // await cmd('echo "\n🎁 $(tput bold)Creating longform and snippet folders...$(tput sgr0)\n"')
    // await cmd('mkdir -p build/longform build/snippet')
    // await cmd('mv build/index.html build/longform/index.html')
    // await cmd('mv build/static build/longform/static')
    // await cmd('cp build/longform/index.html build/snippet/index.html')
    // await cmd('cp -r build/longform/static build/snippet/static')
    // await cmd('echo "./build/longform\n./build/snippet"')

    // // Zip the longform folder
    // await cmd('echo "\n🤐 $(tput bold)Zipping the longform build...$(tput sgr0)\n"')
    // await cmd('cd build && zip -r longform.zip longform && cd ../')
    // await cmd('rm -rf build/longform')

    // // For the snippet, relink assets to the specified external URL
    // if (config.assets_root_url) {
    //   await cmd('echo "\n🔗 $(tput bold)Relinking assets for snippet output...$(tput sgr0)\n"')
    //   const assetsRootUrl = config.assets_root_url.replace(/\/$/, '')
    //   const snippetIndexHtmlFilePath = path.join(pwd, 'build/snippet/index.html')
    //   const snippetIndexHtmlContent = readFileSync(snippetIndexHtmlFilePath, { encoding: 'utf8' })
    //   const snippetIndexHtmlDom = new JSDOM(snippetIndexHtmlContent)
    //   const snippetIndexHtmlDomDocument = snippetIndexHtmlDom.window.document
    //   const $snippetIndexHtmlLinks = [...snippetIndexHtmlDomDocument.querySelectorAll('link[rel=stylesheet]')].reverse()
    //   const $snippetIndexHtmlScripts = [...snippetIndexHtmlDomDocument.querySelectorAll('script')]
    //   const $snippetIndexHtmlBody = snippetIndexHtmlDomDocument.body
    //   $snippetIndexHtmlLinks.forEach($link => {
    //     $snippetIndexHtmlBody.prepend($link)
    //     const href = $link.getAttribute('href')
    //     const newHref = href.replace(/^./, assetsRootUrl)
    //     if (newHref !== href) $link.setAttribute('href', newHref)
    //   })
    //   $snippetIndexHtmlScripts.forEach($script => {
    //     const src = $script.getAttribute('src')
    //     const newSrc = src.replace(/^./, assetsRootUrl)
    //     if (newSrc !== src) $script.setAttribute('src', newSrc)
    //   })

    //   const prettySnippetIndexHtmlContent = pretty(snippetIndexHtmlDomDocument.body.innerHTML)
    //   writeFileSync(snippetIndexHtmlFilePath, prettySnippetIndexHtmlContent, { encoding: 'utf8' })
    //   await cmd('echo "./build/snippet/index.html"')
    // }

    // // Done
    // await cmd('echo "\n🍸 $(tput bold)That\'s all good my friend!$(tput sgr0)\n"')
    // await cmd('echo "If you\'re building a longform, just take the zip and upload it."')
    // await cmd('echo "If you\'re building a snippet, dont forget to upload statics to the place you specified in /src/config.json/assets_root_url!"')
    // await cmd('echo "Bye now."')
  } catch (err) {
    console.log('\n', err)
    process.exit(1)
  }
}
