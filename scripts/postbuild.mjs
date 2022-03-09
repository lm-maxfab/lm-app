import path from 'path'
import process from 'process'
import prompts from 'prompts'
import fse from 'fs-extra'
import chalk from 'chalk'
import execPromise from './modules/exec-promise/index.mjs'
import { latestVersionIn, promptTargetVersionFrom, versionToString, initialVersion } from './modules/versionning/index.mjs'
import { Directory } from './modules/file-system/index.mjs'

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
  const buildAssetsFiles = await BUILD_ASSETS.list()
  const BUILD_INDEX_JS = buildAssetsFiles.find(file => file.name.match(/^index.[a-f0-9]{8}.js$/gm))
  const BUILD_VENDOR_JS = buildAssetsFiles.find(file => file.name.match(/^vendor.[a-f0-9]{8}.js$/gm))
  const BUILD_INDEX_CSS = buildAssetsFiles.find(file => file.name.match(/^index.[a-f0-9]{8}.css$/gm))
  const bundledExec = await execPromise(`npx rollup -i ${BUILD_INDEX_JS.path} -o ${path.join(BUILD_ASSETS.path, `index.${versionName}.js`)} -f iife`)
  
  // const dstAssetsFiles = await DST_ASSETS.list()
  // const DST_INDEX_JS = dstAssetsFiles.find(file => file.name.match(/^index.[a-f0-9]{8}.js$/gm))
  // const DST_VENDOR_JS = dstAssetsFiles.find(file => file.name.match(/^vendor.[a-f0-9]{8}.js$/gm))
  // const DST_INDEX_CSS = dstAssetsFiles.find(file => file.name.match(/^index.[a-f0-9]{8}.css$/gm))
  // const rollupExec = await exec(`npx rollup -i ${DST_INDEX_JS.path} -o ${path.join(DST_ASSETS.path, 'rolledup.js')} -f iife`)
  // const DST_ROLLEDUP_JS = await DST_ASSETS.get('rolledup.js')
  // if (rollupExec.stdout !== '') console.log(chalk.grey(rollupExec.stdout.trim()))
  // if (rollupExec.stderr !== '') console.log(chalk.grey(rollupExec.stderr.trim()))
}
