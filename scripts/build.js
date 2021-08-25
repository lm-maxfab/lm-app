/* eslint-disable no-template-curly-in-string */
const { readFileSync, writeFileSync } = require('fs')
const path = require('path')
const jsdom = require('jsdom')
const pretty = require('pretty')
const { cmd, laxcmd, updatePreload } = require('./_utils')

const { JSDOM } = jsdom

build()

async function build () {
  try {
    // Update spreadsheet preload
    await cmd('echo "\n⏬ $(tput bold)Updating spreadsheet preload...$(tput sgr0)\n"')
    await updatePreload()
    await cmd('echo "./src/preload.js"')

    // Run standard.js
    await cmd('echo "\n👀 $(tput bold)Running standard.js...$(tput sgr0)\n"')
    await laxcmd('npx ts-standard --verbose | snazzy')

    // Check git status
    await cmd('echo "\n📡 $(tput bold)Checking git status...$(tput sgr0)\n"')
    await cmd('git status')

    // Remove previous build
    await cmd('echo "\n🧹 $(tput bold)Removing previous build...$(tput sgr0)\n"')
    await cmd('rm -rfv ./build ./build.zip')

    // Build the app
    await cmd('echo "\n🛠  $(tput bold)Building the app...$(tput sgr0)\n"')
    await cmd('INLINE_RUNTIME_CHUNK=false GENERATE_SOURCEMAP=false SKIP_PREFLIGHT_CHECK=true react-scripts build')

    // Relink the development statics to the production ones
    await cmd('echo "\n🔗 $(tput bold)Relinking statics...$(tput sgr0)\n"')
    const pwd = (await cmd('pwd', false)).trim()
    const fontsCssFilePath = path.join(pwd, 'build/static/lm-app/styles/fonts.css')
    const fontsCssContent = readFileSync(fontsCssFilePath, { encoding: 'utf8' })
    const originalPath = /..\/..\/lemonde\/fonts/g
    const replacedPath = 'https://lemonde.fr/dist/assets/fonts'
    const altOriginalPath = /..\/fonts\/marr-sans\/MarrSans-Bold-Web/g
    const altReplacedPath = 'https://assets-decodeurs.lemonde.fr/redacweb/statics/fonts/marr-sans/MarrSans-Bold-Web'
    const replacedFontsCssContent = fontsCssContent
      .replace(originalPath, replacedPath)
      .replace(altOriginalPath, altReplacedPath)
    writeFileSync(fontsCssFilePath, replacedFontsCssContent, { encoding: 'utf8' })
    await cmd('echo "./build/static/lm-app/styles/fonts.css"')
    
    const indexHtmlFilePath = path.join(pwd, 'build/index.html')
    const indexHtmlContent = readFileSync(indexHtmlFilePath, { encoding: 'utf8' })
    const { window } = new JSDOM(indexHtmlContent)
    const { document } = window
    const $links = [...document.querySelectorAll('link[rel=stylesheet]')]
    $links.forEach($link => {
      const hrefAttr = $link.getAttribute('href')
      if (hrefAttr.match(/^.\/static\/lemonde/)) $link.remove()
    })
    const prettyReplacedIndexHtmlContent = pretty(document.documentElement.outerHTML)
      .split('\n')
      .filter(line => line !== '')
      .join('\n')
      .replace('<body>', '<body>\n    ')
    const replacedIndexHtmlContent = `${prettyReplacedIndexHtmlContent}\n`
    writeFileSync(indexHtmlFilePath, replacedIndexHtmlContent, { encoding: 'utf8' })
    await cmd('echo "./build/index.html"')
    
    // Remove development statics
    await cmd('echo "\n🧽 $(tput bold)Removing all .DS_Store, asset-manifest.json, development statics...$(tput sgr0)\n"')
    await cmd('touch build/.DS_Store')
    await cmd('find . -name ".DS_Store" -print -delete')
    await cmd('rm -rfv ./build/asset-manifest.json')
    await cmd('rm -rfv ./build/static/lemonde')
    
    // Bundle in single file if snippet mode
    // if (process.argv[2] === '--onefile') {
    //   await cmd('echo "\n🤖 $(tput bold)Creating gulpfile.js ...$(tput sgr0)\n"')
    //   await cmd('rm -rfv gulpfile.js')
    //   await cmd('echo "const gulp = require(\'gulp\')" >> gulpfile.js')
    //   await cmd('echo "const inlinesource = require(\'gulp-inline-source\')" >> gulpfile.js')
    //   await cmd('echo "const replace = require(\'gulp-replace\')" >> gulpfile.js')
    //   await cmd('echo "gulp.task(\'default\', () => gulp" >> gulpfile.js')
    //   await cmd('echo "  .src(\'./build/*.html\')" >> gulpfile.js')
    //   await cmd('echo "  .pipe(replace(\'.js\\"></script>\', \'.js\\" inline></script>\'))" >> gulpfile.js')
    //   await cmd('echo "  .pipe(replace(\'rel=\\"stylesheet\\">\', \'rel=\\"stylesheet\\" inline>\'))" >> gulpfile.js')
    //   await cmd('echo "  .pipe(inlinesource())" >> gulpfile.js')
    //   await cmd('echo "  .pipe(gulp.dest(\'./build\')))" >> gulpfile.js')
    //   await cmd('cat gulpfile.js')

    //   await cmd('echo "\n📦 $(tput bold)Bundling everything inside index.html...$(tput sgr0)\n"')
    //   await cmd('npx gulp')

    //   await cmd('echo "\n🧽 $(tput bold)Removing bundled files...$(tput sgr0)\n"')
    //   await cmd('rm -rfv build/static')

    //   await cmd('echo "\n🧽 $(tput bold)Removing gulpfile.js...$(tput sgr0)\n"')
    //   await cmd('rm -rfv gulpfile.js')
    // }

    // Create longform and snippet folders
    await cmd('echo "\n🎁 $(tput bold)Creating longform and snippet folders...$(tput sgr0)\n"')
    await cmd('mkdir -p build/longform build/snippet')
    await cmd('mv build/index.html build/longform/index.html')
    await cmd('mv build/static build/longform/static')
    await cmd('cp build/longform/index.html build/snippet/index.html')
    await cmd('cp -r build/longform/static build/snippet/static')
    await cmd('echo "./build/longform\n./build/snippet"')
    
    await cmd('echo "\n🤐 $(tput bold)Zipping the longform build...$(tput sgr0)\n"')
    await cmd('cd build && zip -r longform.zip longform && cd ../')
    await cmd('rm -rf build/longform') 
    
    // WIP - in snippet/index.html
    //   - loop through all <link> and <script> tags
    //   - place links inside the body
    //   - relink urls via config.assets_root_url
    //   - final file contains only `document.body.innerHTML`

    // Done
    await cmd('echo "\n🍸 $(tput bold)That\'s all good my friend!$(tput sgr0)\n"')
  } catch (err) {
    console.log('\n', err)
    process.exit(1)
  }
}
