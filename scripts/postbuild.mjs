import path from 'path'
import process from 'process'
import prompts from 'prompts'
import fse from 'fs-extra'
import chalk from 'chalk'
import execPromise from './modules/exec-promise/index.mjs'
import { latestVersionIn, promptTargetVersionFrom, versionToString, initialVersion } from './modules/versionning/index.mjs'
import { Directory, File } from './modules/file-system/index.mjs'

postbuild()

const __dirname = process.cwd()
const PATHS = {}
PATHS.ROOT = __dirname
PATHS.BUILDS_JSON = path.join(__dirname, 'builds.json')

async function postbuild () {

  const doVersionAndCommit = (await prompts({
    type: 'confirm',
    name: 'response',
    message: 'Do you want to version and commit this build?'
  })).response

  // Get versionning info
  const buildsJsonStrContent = await fse.readFile(PATHS.BUILDS_JSON, 'utf-8')
  const buildsData = JSON.parse(buildsJsonStrContent)
  const currentBranch = (await execPromise('git branch --show-current')).stdout.trim()
  const currentBranchBuilds = buildsData[currentBranch]
  const currentBranchLatestBuild = latestVersionIn(currentBranchBuilds) ?? initialVersion
  const targetBuildVersion = doVersionAndCommit ? await promptTargetVersionFrom(currentBranchLatestBuild) : undefined
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
  
  // // Lint
  // console.log(chalk.bold('\n👀 Linting...\n'))
  // try {
  //   const lintExec = await execPromise('npm run lint')
  //   if (lintExec.stdout !== '') console.log(chalk.grey(lintExec.stdout))
  //   if (lintExec.stderr !== '') {
  //     console.log(chalk.red(lintExec.stderr))
  //     const lintContinue = (await prompts({
  //       type: 'confirm',
  //       name: 'lintContinue',
  //       message: 'You have lint errors, do you want to continue?'
  //     })).lintContinue
  //     if (!lintContinue) throw new Error('You aborted build process due to lint errors.')
  //   }
  // } catch (err) {
  //   if (err.stdout !== '') console.log(chalk.grey(err.stdout))
  //   if (err.stderr !== '') console.log(chalk.red(err.stderr))
  //   if (err.err !== '') console.log(chalk.red(err.err))
  //   if (err.stderr !== '' || err.err !== '') {
  //     const lintContinue = (await prompts({
  //       type: 'confirm',
  //       name: 'lintContinue',
  //       message: 'You have lint errors, do you want to continue?'
  //     })).lintContinue
  //     if (!lintContinue) throw new Error('You aborted build process due to lint errors.')
  //   }
  // }

  // Check git status
  if (doVersionAndCommit) console.log(chalk.bold('\n📡 Checking git status...\n'))
  const gitStatus = await execPromise('git status')
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

  // Delete dev resources in index.html
  const BUILD_INDEX = new File(path.join(__dirname, 'build/index.html'))
  await BUILD_INDEX.editHTMLQuiet(jsdom => {
    const document = jsdom.window.document
    const documentElement = document.documentElement
    const nodesToDelete = [...documentElement.querySelectorAll('.delete-at-build')]
    nodesToDelete.forEach(node => node.remove())
    return jsdom
  })

  // Replace {{ASSETS_ROOT_URL}} and http://localhost:3001 everywhere
  console.log(chalk.bold(`\n🔗 Relinking assets...\n`))
  const CONFIG = new File(path.join(__dirname, 'config.json'))
  const config = JSON.parse(await CONFIG.read())
  console.log(`[\/\.]*{{ASSETS_ROOT_URL}} => ${config.assets_root_url}`)
  console.log(`http://localhost:3001 => ${config.statics_root_url}`)
  const BUILD = new Directory(path.join(__dirname, 'build'))
  const pathsToBatchEdit = await deepLs(BUILD.path)
  await batchFileEdit(pathsToBatchEdit, BUILD.path, fileData => {
    const newContent = fileData.content
      .replace(/[\/\.]*{{ASSETS_ROOT_URL}}/gm, config.assets_root_url)
      .replace(/http:\/\/localhost:3001/gm, config.statics_root_url)
    return newContent
  })

  // Bundle vendor and index js into a single iife
  console.log(chalk.bold('\n⚙️  Bundle vendor and index into a single IIFE...\n'))
  const BUILD_ASSETS = new Directory(path.join(__dirname, 'build/{{ASSETS_ROOT_URL}}'))
  await BUILD_ASSETS.moveTo('assets')
  let buildAssetsFiles = await BUILD_ASSETS.list()
  const BUILD_INDEX_JS = buildAssetsFiles.find(file => file.name.match(/^index.[a-f0-9]{8}.js$/gm))
  const BUILD_VENDOR_JS = buildAssetsFiles.find(file => file.name.match(/^vendor.[a-f0-9]{8}.js$/gm))
  const versionNameForFileNames = versionName ?? 'no-version'
  await execPromise(`npx rollup -i ${BUILD_INDEX_JS.path} -o ${path.join(BUILD_ASSETS.path, `index.${versionNameForFileNames}.js`)} -f iife`)
  buildAssetsFiles = await BUILD_ASSETS.list()

  // Create .<version>, .latest and .live js and css files
  console.log(chalk.bold(`\n👭 Creating .${versionNameForFileNames}, .latest and .live js and css files...\n`))
  const BUILD_VERSIONNED_JS = buildAssetsFiles.find(file => file.name === `index.${versionNameForFileNames}.js`)
  await BUILD_VERSIONNED_JS.editQuiet(content => `/* Version: ${versionName}, date: ${buildTime.toISOString()} built index.js: ${BUILD_INDEX_JS.name}, built vendor.js: ${BUILD_VENDOR_JS.name} */\n${content}`)
  await BUILD_VERSIONNED_JS.copyTo(`index.latest.js`)
  if (linkToLive) await BUILD_VERSIONNED_JS.copyTo(`index.live.js`)
  const BUILD_INDEX_CSS = buildAssetsFiles.find(file => file.name.match(/^index.[a-f0-9]{8}.css$/gm))
  await BUILD_INDEX_CSS.copyTo(`index.${versionNameForFileNames}.css`)
  await BUILD_INDEX_CSS.copyTo(`index.latest.css`)
  if (linkToLive) await BUILD_INDEX_CSS.copyTo(`index.live.css`)

  // Link index.html to live js and css
  await BUILD_INDEX.editHTMLQuiet(jsdom => {
    const document = jsdom.window.document
    const documentElement = document.documentElement
    const vendorTag = documentElement.querySelector(`link[href*="${BUILD_VENDOR_JS.name}"]`)
    vendorTag.remove()
    const indexJsTag = documentElement.querySelector(`script[src*="${BUILD_INDEX_JS.name}"]`)
    indexJsTag.outerHTML = `<script async type="text/javascript" src="${config.assets_root_url}/index.live.js"></script>`
    const indexCssTag = documentElement.querySelector(`link[href*="${BUILD_INDEX_CSS.name}"]`)
    indexCssTag.outerHTML = `<link rel="stylesheet" href="${config.assets_root_url}/index.live.css">`
    return jsdom
  })
  await BUILD_INDEX.editQuiet(content => {
    return content.split('\n')
      .filter(line => line.trim() !== '')
      .join('\n')
      .replace('<html lang="en"><head>', '<html lang="en">\n  <head>')
      .replace('</body></html>', '  </body>\n</html>')
      + '\n'
  })

  await BUILD.mkdir('layouts')
  const LAYOUTS = await BUILD.get('layouts')
  for (const layoutData of config.layouts) {
    await LAYOUTS.mkdir(layoutData.name)
    const LAYOUT = await LAYOUTS.get(layoutData.name)
    await fse.copy(BUILD_INDEX.path, `${LAYOUT.path}/index.html`)
    const INDEX = new File(path.join(LAYOUT.path, 'index.html'))
    await INDEX.editHTMLQuiet(jsdom => {
      const document = jsdom.window.document
      const documentElement = document.documentElement
      const $lmAppConfig = documentElement.querySelector('.lm-app-config')
      const layoutNodesHTML = layoutData.nodes
        .map(nodeData => `<div class="lm-app-root lm-app-root_${nodeData.type} ${nodeData.class}"></div>`)
        .join('\n')
      $lmAppConfig.insertAdjacentHTML('afterend', `\n${layoutNodesHTML}`)
      return jsdom
    })

    for (const env of ['testing', 'staging', 'production']) {
      await LAYOUT.mkdir(env)
      await INDEX.copyTo(`./${env}/index.html`)
      const ENV_INDEX = await LAYOUT.get(`${env}/index.html`)
      await ENV_INDEX.editHTMLQuiet(jsdom => {
        const document = jsdom.window.document
        const documentElement = document.documentElement
        const $lmAppConfig = documentElement.querySelector('.lm-app-config')
        $lmAppConfig.innerHTML = JSON.stringify({ ...config, env }, null, null).replace(/\n/gm, '\n    ')
        return jsdom
      })
      await ENV_INDEX.prettifyHTMLQuiet()
    }
    await INDEX.deleteSelfQuiet()
  }
  await BUILD_INDEX.deleteSelfQuiet()

  // Remove all .DS_Store files in build
  console.log(chalk.bold('\n🧹 Removing all .DS_Store files...\n'))
  await execPromise(`cd ${BUILD.path} && find . -name ".DS_Store" -print -delete`)
  console.log(chalk.grey('removed.'))

  // Write build info to builds.json
  if (doVersionAndCommit) {
    console.log(chalk.bold('\n✍️  Storing build info to builds.json...\n'))
    await new File(PATHS.BUILDS_JSON).editQuiet(content => {
      const parsed = JSON.parse(content)
      if (parsed[currentBranch] === undefined) parsed[currentBranch] = []
      const branchData = parsed[currentBranch]
      const newBuildData = {
        version: targetBuildVersion,
        description: buildDescription,
        time: buildTime
      }
      branchData.push(newBuildData)
      const returned = JSON.stringify(parsed, null, 2) + '\n'
      return returned
    })
    console.log(chalk.grey('stored.'))
  }

  // Commit and push to Github
  if (doVersionAndCommit) {
    console.log(chalk.bold('\n📣 Commiting and pushing to Github...'))
    await execPromise('git add -u')
    await execPromise(`git commit -m "BUILD - ${currentBranch} - ${buildVersionNameWithDesc}"`)
    const pushResult = await execPromise(`git push origin ${currentBranch}`)
    console.log(chalk.grey(`\nPushed: BUILD - ${buildVersionNameWithDesc}`))
    if (pushResult.stdout !== '') console.log(`${chalk.grey(pushResult.stdout.trim())}`)
    if (pushResult.stderr !== '') console.log(`${chalk.grey(pushResult.stderr.trim())}`)
  }

  // The end.
  console.log(chalk.bold('\n🍸 That\'s all good my friend!\n'))
  
  



  
  // const dstAssetsFiles = await DST_ASSETS.list()
  // const DST_INDEX_JS = dstAssetsFiles.find(file => file.name.match(/^index.[a-f0-9]{8}.js$/gm))
  // const DST_VENDOR_JS = dstAssetsFiles.find(file => file.name.match(/^vendor.[a-f0-9]{8}.js$/gm))
  // const DST_INDEX_CSS = dstAssetsFiles.find(file => file.name.match(/^index.[a-f0-9]{8}.css$/gm))
  // const rollupExec = await exec(`npx rollup -i ${DST_INDEX_JS.path} -o ${path.join(DST_ASSETS.path, 'rolledup.js')} -f iife`)
  // const DST_ROLLEDUP_JS = await DST_ASSETS.get('rolledup.js')
  // if (rollupExec.stdout !== '') console.log(chalk.grey(rollupExec.stdout.trim()))
  // if (rollupExec.stderr !== '') console.log(chalk.grey(rollupExec.stderr.trim()))
}

async function deepLs (srcPath) {
  const files = await fse.readdir(srcPath)
  const results = []
  for (let file of files) {
    const filePath = path.join(srcPath, file)
    const fileStat = await fse.stat(filePath)
    const isDirectory = fileStat.isDirectory()
    if (!isDirectory) results.push(filePath)
    else results.push(...(await deepLs(filePath)))
  }
  return results
}

function isPathInScope (_path, scope = './') {
  const isScopeAbsolute = path.isAbsolute(scope)
  const absoluteScope = isScopeAbsolute ? scope : path.join(process.cwd(), scope)
  const absolutePath = path.isAbsolute(_path) ? _path : path.join(process.cwd(), _path)
  const relativeToScopePath = path.relative(absoluteScope, absolutePath)
  const isInScope = relativeToScopePath  
      && !relativeToScopePath.startsWith('..')
      && !path.isAbsolute(relativeToScopePath)
  return isInScope
}

async function batchFileEdit (paths, scope = './', editorFunc, editorCallback) {
  const isScopeAbsolute = path.isAbsolute(scope)
  const absoluteScope = isScopeAbsolute ? scope : path.join(process.cwd(), scope)
  const absolutePaths = paths.map(relativePath => {
    return path.isAbsolute(relativePath)
      ? relativePath
      : path.join(process.cwd(), relativePath)
  }).filter(absolutePath => {
    return isPathInScope(absolutePath, absoluteScope)
  })

  for (const absolutePath of absolutePaths) {
    const extension = path.extname(absolutePath)
    const basename = path.basename(absolutePath)
    const content = await fse.readFile(absolutePath, 'utf8')
    const newContent = await editorFunc({ path: absolutePath, extension, basename, content })
    
    if (newContent === undefined) {
      await fse.rm(absolutePath, { force: true })
      continue
    }
    
    if (content !== newContent) await fse.writeFile(
      absolutePath,
      newContent,
      { encoding: 'utf8' }
    )

    if (typeof editorCallback === 'function') await editorCallback({
      path: absolutePath,
      extension,
      basename,
      content: newContent
    })
  }
}
