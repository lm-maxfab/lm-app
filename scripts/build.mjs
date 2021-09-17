/* eslint-disable no-template-curly-in-string */
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'
import jsdom from 'jsdom'
import pretty from 'pretty'
import prompt from 'async-prompt'
import moment from 'moment'
import { laxcmd, cmd, updatePreload } from './_utils.mjs'

// import { assets_root_url } from '../src/config.json'
const rawConfigJson = readFileSync('src/config.json', { encoding: 'utf8' })
const config = JSON.parse(rawConfigJson)
const { assets_root_url } = config

const { JSDOM } = jsdom

build()

async function build () {
  try {
    // // Update spreadsheet preload
    // await cmd('echo "\n⏬ $(tput bold)Updating spreadsheet preload...$(tput sgr0)\n"')
    // await updatePreload()
    // await cmd('echo "./src/preload.ts"')

    // // Run standard.js
    // await cmd('echo "\n👀 $(tput bold)Linting...$(tput sgr0)\n"')
    // try {
    //   await cmd('npm run lint')
    // } catch (err) {
    //   console.log(err.stdout)
    //   const userInput = await prompt('Your code shows lint errors, do you want to continue ? (y/n): ')
    //   if (!userInput.match(/^y$/i)) {
    //     await cmd('echo "Ok, bye."')
    //     process.exit(1)
    //   }
    // }

    // Check git status
    await cmd('echo "\n📡 $(tput bold)Checking git status...$(tput sgr0)\n"')
    const gitStatus = await cmd('git status')
    const gitStatusIsClean = gitStatus.split('\n').find(line => line === 'nothing to commit, working tree clean')
    if (!gitStatusIsClean) {
      const userInput = await prompt('You have uncommited changes to your code, do you want to continue ? (y/n): ')
      if (!userInput.match(/^y$/i)) {
        await cmd('echo "Ok, bye."')
        process.exit(1)
      }
    }

    // Move files to be built
    await cmd('rm -rf .temp')
    await cmd('mkdir .temp')
    await cmd('cp index.html .temp/index.html')
    await cmd('cp -r src .temp/src')
    await cmd('cp -r static .temp/static')

    // Remove dev css files
    await cmd('rm -rf .temp/static/lemonde')

    // Remove dev stuff in index.html
    const pwd = (await cmd('pwd', false)).trim()
    const indexHtmlFilePath = join(pwd, '.temp/index.html')
    const indexHtmlContent = readFileSync(indexHtmlFilePath, { encoding: 'utf8' })
    const indexHtmlDom = new JSDOM(indexHtmlContent)
    const indexHtmlDomDocument = indexHtmlDom.window.document
    const $indexHtmlLinks = indexHtmlDomDocument.querySelectorAll('link')
    $indexHtmlLinks.forEach(($link) => {
      const href = $link.getAttribute('href')
      console.log(href)
      const isToDelete = href.match(/^\.\/static\/lemonde/)
      if (isToDelete) $link.remove()
    })
    const $header = indexHtmlDomDocument.querySelector('.lm-app-fake-lm-header')
    const $footer = indexHtmlDomDocument.querySelector('.lm-app-fake-lm-footer')
    $header.remove()
    $footer.remove()
    const indexHtmlUpdatedContent = indexHtmlDomDocument.documentElement.outerHTML
    writeFileSync(indexHtmlFilePath, indexHtmlUpdatedContent)

    // Remove previous build
    await cmd('echo "\n🧹 $(tput bold)Removing previous build...$(tput sgr0)\n"')
    await cmd('rm -rfv ./build')

    // Build the app
    await cmd('echo "\n🛠  $(tput bold)Building the app...$(tput sgr0)\n"')
    try {
      await cmd('tsc && vite build')
    } catch (err) {
      console.log(err)
      const userInput = await prompt('Come errors occured during build, do you want to continue ? (y/n): ')
      if (!userInput.match(/^y$/i)) {
        await cmd('echo "Ok, bye."')
        process.exit(1)
      }
    }

    // Delete .temp
    await cmd('rm -rf .temp')

    // // Duplicate dev files
    // await cmd('echo "\n🗑️  $(tput bold)Removng development statics and fake lemonde.fr page elements...$(tput sgr0)\n"')
    // await cmd('rm -rf .temp')
    // await cmd('mkdir .temp')
    // await cmd('cp -r src .temp/src')
    // await cmd('cp -r static .temp/static')
    // await cmd('cp index.html .temp/index.html')

    // // Remove dev css files
    // await cmd('rm -rf .temp/static/lemonde')

    // // Remove dev stuff in index.html
    // const pwd = (await cmd('pwd', false)).trim()
    // const indexHtmlFilePath = join(pwd, '.temp/index.html')
    // const indexHtmlContent = readFileSync(indexHtmlFilePath, { encoding: 'utf8' })
    // const indexHtmlDom = new JSDOM(indexHtmlContent)
    // const indexHtmlDomDocument = indexHtmlDom.window.document

    // // Strip all links towards dev stuff
    // const $indexHtmlLinks = indexHtmlDomDocument.querySelectorAll('link')
    // $indexHtmlLinks.forEach(($link) => {
    //   const href = $link.getAttribute('href')
    //   console.log(href)
    //   const isToDelete = href.match(/^\.\/static\/lemonde/)
    //   if (isToDelete) $link.remove()
    // })

    // // Remove fake header and fake footer
    // const $header = indexHtmlDomDocument.querySelector('.lm-app-fake-lm-header')
    // const $footer = indexHtmlDomDocument.querySelector('.lm-app-fake-lm-footer')
    // $header.remove()
    // $footer.remove()
    // const indexHtmlUpdatedContent = indexHtmlDomDocument.documentElement.outerHTML
    // writeFileSync(indexHtmlFilePath, indexHtmlUpdatedContent)

    // // Backup dev files
    // await cmd('rm -rf .bak')
    // await cmd('mkdir .bak')
    // await cmd('mv src .bak/src')
    // await cmd('mv static .bak/static')
    // await cmd('mv index.html .bak/index.html')
    // await cmd('mv .temp/src src')
    // await cmd('mv .temp/static static')
    // await cmd('mv .temp/index.html index.html')

    // // Remove previous build
    // await cmd('echo "\n🧹 $(tput bold)Removing previous build...$(tput sgr0)\n"')
    // await cmd('rm -rfv ./build ./build.zip')

    // // Build the app
    // await cmd('echo "\n🛠  $(tput bold)Building the app...$(tput sgr0)\n"')
    // let shouldQuitAfterBuild = false
    // try {
    //   await cmd('tsc && vite build')
    // } catch (err) {
    //   console.log(err)
    //   const userInput = await prompt('Come errors occured during build, do you want to continue ? (y/n): ')
    //   if (!userInput.match(/^y$/i)) {
    //     shouldQuitAfterBuild = true
    //     await cmd('echo "Ok, bye."')
    //   }
    // }

    // await cmd('rm -rf index.html src static')
    // await cmd('mv .bak/index.html index.html')
    // await cmd('mv .bak/src src')
    // await cmd('mv .bak/static static')
    // await cmd('rm -rf .temp .bak')
    // if (shouldQuitAfterBuild) process.exit(1)

    // const listFiles = readdirSync(join(pwd, 'build/assets'))
    // const indexJsFileName = listFiles.find(name => name.match(/^index.[a-f0-9]{8,}.js$/))
    // const indexJsFilePath = join(pwd, 'build/assets', indexJsFileName)
    // const puteJsFilePath = join(pwd, 'build/assets', 'pute.js')
    // await laxcmd(`npx rollup -i ${indexJsFilePath} -o ${puteJsFilePath} -f iife`)
    // await cmd(`rm -rf ${indexJsFilePath}`)
    // await cmd(`mv ${puteJsFilePath} ${indexJsFilePath}`)

    // // Store build info inside build/index.html
    // await cmd('echo "\n✍️  $(tput bold)Storing build info...$(tput sgr0)\n"')
    // const now = moment().toString()
    // const currentBranch = await cmd('git rev-parse --abbrev-ref HEAD', false)
    // const currentCommit = await cmd('git show --oneline -s', false)
    // const indexHtml2FilePath = join(pwd, 'build/index.html')
    // const indexHtml2Content = readFileSync(indexHtml2FilePath, { encoding: 'utf8' })
    // const indexHtml2Dom = new JSDOM(indexHtml2Content)
    // const indexHtml2DomDocument = indexHtml2Dom.window.document
    // const $buildInfoNode = indexHtml2DomDocument.createElement('span')
    // $buildInfoNode.setAttribute('id', 'lm-app-build-info')
    // $buildInfoNode.style.display = 'none'
    // $buildInfoNode.style.fontSize = '0px'
    // $buildInfoNode.style.lineHeight = '0px'
    // $buildInfoNode.style.color = 'transparent'
    // $buildInfoNode.innerHTML += '\n      <p>BUILD INFO</p>'
    // $buildInfoNode.innerHTML += '\n      <p>==========</p>'
    // $buildInfoNode.innerHTML += `\n      <p>Time: ${now}</p>`
    // $buildInfoNode.innerHTML += '\n      <p>Repo: https://github.com/lm-maxfab/lm-app</p>'
    // $buildInfoNode.innerHTML += `\n      <p>Branch: ${currentBranch.trim()}</p>`
    // $buildInfoNode.innerHTML += `\n      <p>Commit: ${currentCommit.trim()}</p>`
    // if (assets_root_url) $buildInfoNode.innerHTML += `\n      <p>Assets: ${assets_root_url}</p>`
    // if (!gitStatusIsClean) $buildInfoNode.innerHTML += '\n      <p>Built with some uncommited changes.</p>'
    // indexHtml2DomDocument.body.prepend($buildInfoNode)
    // console.log($buildInfoNode.innerHTML.replace(/<\/?p>/gm, '').replace(/\n\s{2,}/gm, '\n'), '\n')

    // // Write updated build/index.html
    // const prettyReplacedIndexHtml2Content = pretty(
    //   indexHtml2DomDocument.documentElement.outerHTML
    //     .replace('<span id="lm-app-build-info"', '\n<span id="lm-app-build-info"')
    //     .replace('</span><noscript', '\n    </span>\n<noscript')
    // ).split('\n')
    //   .filter(line => line !== '')
    //   .join('\n')
    // const replacedIndexHtml2Content = `${prettyReplacedIndexHtml2Content}\n`
    // writeFileSync(indexHtml2FilePath, replacedIndexHtml2Content, { encoding: 'utf8' })
    // await cmd('echo "./build/index.html"')

    // // Remove development files & statics
    // await cmd('echo "\n🧽 $(tput bold)Removing all .DS_Store, asset-manifest.json, development statics...$(tput sgr0)\n"')
    // await cmd('touch build/.DS_Store')
    // await cmd('find . -name ".DS_Store" -print -delete')







    // await cmd('rm -rfv ./build/asset-manifest.json')
    // await cmd('rm -rfv ./build/static/lemonde')

    // Create longform and snippet builds
    // await cmd('echo "\n🎁 $(tput bold)Creating longform and snippet builds...$(tput sgr0)\n"')
    // await cmd('mkdir -p build/longform build/snippet')
    // await cmd('mv build/index.html build/longform/index.html')
    // await cmd('mv build/static build/longform/static')
    // await cmd('cp build/longform/index.html build/snippet/index.html')
    // await cmd('cp -r build/longform/static build/snippet/static')
    // await cmd('echo "./build → ./build/longform\n./build → ./build/snippet"')

    // Zip the longform build
    // await cmd('echo "\n🤐 $(tput bold)Zipping the longform build...$(tput sgr0)\n"')
    // await cmd('cd build && zip -r longform.zip longform && cd ../')

    // For the snippet, relink assets to the specified external URL
    // const assetsRootUrl = assets_root_url?.replace(/\/$/, '')
    // const snippetIndexHtmlFilePath = join(pwd, 'build/snippet/index.html')
    // const snippetIndexHtmlContent = readFileSync(snippetIndexHtmlFilePath, { encoding: 'utf8' })
    // const snippetIndexHtmlDom = new JSDOM(snippetIndexHtmlContent)
    // const snippetIndexHtmlDomDocument = snippetIndexHtmlDom.window.document
    // const $snippetIndexHtmlLinks = [...snippetIndexHtmlDomDocument.querySelectorAll('link[rel=stylesheet]')].reverse()
    // const $snippetIndexHtmlScripts = [...snippetIndexHtmlDomDocument.querySelectorAll('script')]
    // const $snippetIndexHtmlBody = snippetIndexHtmlDomDocument.body
    // if (assetsRootUrl !== undefined) {
    //   await cmd('echo "\n🔗 $(tput bold)Relinking assets for the snippet build...$(tput sgr0)\n"')
    //   $snippetIndexHtmlLinks.forEach($link => {
    //     const href = $link.getAttribute('href')
    //     const newHref = href.replace(/^./, assetsRootUrl)
    //     if (newHref !== href) $link.setAttribute('href', newHref)
    //   })
    //   $snippetIndexHtmlScripts.forEach($script => {
    //     const src = $script.getAttribute('src')
    //     const newSrc = src.replace(/^./, assetsRootUrl)
    //     if (newSrc !== src) $script.setAttribute('src', newSrc)
    //   })
    // }
    // $snippetIndexHtmlLinks.forEach($link => $snippetIndexHtmlBody.prepend($link))
    // const prettySnippetIndexHtmlContent = pretty(snippetIndexHtmlDomDocument.body.innerHTML)
    //   .replace(/\n\s{6}<p>/gm, '\n  <p>')
    //   .replace(/\n\s{4}<\/span>/gm, '\n</span>')
    // const replacedSnippetIndexHtmlContent = `${prettySnippetIndexHtmlContent}\n`
    // writeFileSync(snippetIndexHtmlFilePath, replacedSnippetIndexHtmlContent, { encoding: 'utf8' })
    // await cmd('echo "./build/snippet/index.html"')

    // Done
    // await cmd('echo "\n🍸 $(tput bold)That\'s all good my friend!$(tput sgr0)\n"')
    // await cmd('echo "If you\'re building a longform, just take the zip and upload it."')
    // await cmd('echo "If you\'re building a snippet, dont forget to upload statics to the place you specified in /src/config.json/assets_root_url!"')
    // await cmd('echo "Bye now."')

    await cmd(`echo "\n🍸 $(tput bold)That\'s all good my friend!$(tput sgr0)\n" &&
      echo "If you\'re building a longform, just take the zip and upload it." &&
      echo "If you\'re building a snippet, dont forget to upload statics to the place you specified in /src/config.json/assets_root_url!" &&
      echo "Bye now."`)
  } catch (err) {
    console.log('\n', err)
    process.exit(1)
  }
}
