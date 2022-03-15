import path from 'path'
import process, { config } from 'process'
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
  
  // Lint
  console.log(chalk.bold('\n👀 Linting...\n'))
  try {
    const lintExec = await execPromise('npm run lint')
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

  // Bundle vendor and index js into a single iife
  console.log(chalk.bold('\n⚙️  Bundle vendor and index into a single IIFE...\n'))
  const BUILD_ASSETS = new Directory(path.join(__dirname, 'build/{{ASSETS_ROOT_URL}}'))
  let buildAssetsFiles = await BUILD_ASSETS.list()
  const BUILD_INDEX_JS = buildAssetsFiles.find(file => file.name.match(/^index.[a-f0-9]{8}.js$/gm))
  const BUILD_VENDOR_JS = buildAssetsFiles.find(file => file.name.match(/^vendor.[a-f0-9]{8}.js$/gm))
  const BUILD_INDEX_CSS = buildAssetsFiles.find(file => file.name.match(/^index.[a-f0-9]{8}.css$/gm))
  const bundledExec = await execPromise(`npx rollup -i ${BUILD_INDEX_JS.path} -o ${path.join(BUILD_ASSETS.path, `index.${versionName ?? 'no-version'}.js`)} -f iife`)

  // Replace {{ASSETS_ROOT_URL}} and http://localhost:3001 everywhere
  const CONFIG = new File(path.join(__dirname, 'config.json'))
  const config = JSON.parse(await CONFIG.read())
  const BUILD = new Directory(path.join(__dirname, 'build'))
  const pathsToBatchEdit = await deepLs(BUILD.path)

  console.log('{{ASSETS_ROOT_URL}} =>', config.assets_root_url)
  console.log('http://localhost:3001 =>', config.statics_root_url)
  await batchFileEdit(pathsToBatchEdit, BUILD.path, fileData => {
    const newContent = fileData.content
      .replace(/(\.*\/*)*{{ASSETS_ROOT_URL}}/gm, config.assets_root_url)
      .replace(/http:\/\/localhost:3001/gm, config.statics_root_url)
    if (newContent !== fileData.content) return newContent
  })
  
  // Generate .latest and .live js and css
  buildAssetsFiles = await BUILD_ASSETS.list()
  const BUILD_VERSIONNED_JS = buildAssetsFiles.find(file => file.name === `index.${versionName ?? 'no-version'}.js`)
  await BUILD_VERSIONNED_JS.copyTo(`index.latest.js`)
  await BUILD_VERSIONNED_JS.copyTo(`index.live.js`)



  
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
