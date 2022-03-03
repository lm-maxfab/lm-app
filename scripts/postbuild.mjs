import path from 'path'
import process from 'process'
import prompts from 'prompts'
import fse from 'fs-extra'

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
  const buildsData = JSON.parse(buildsJsonContent)
  console.log(buildsData)
  
  // const allBuilds = JSON.parse(await BUILDS_JSON.read())
  // const branch = (await exec('git branch --show-current')).stdout.trim()
  // const builds = allBuilds[branch] ?? []
  // const latestBuildVersion = latestVersionIn(builds) ?? initialVersion
  // const targetBuildVersion = doVersionAndCommit ? await promptTargetVersionFrom(latestBuildVersion) : undefined
  // const versionName = doVersionAndCommit ? versionToString(targetBuildVersion) : undefined
  // const buildTime = new Date()
  // const promptsVersionDescriptionOptions = {
  //   type: 'text',
  //   name: 'description',
  //   message: 'Description of the build version:'
  // }
  // const buildDescription = doVersionAndCommit ? (await prompts(promptsVersionDescriptionOptions)).description : undefined
  // const buildVersionNameWithDesc = doVersionAndCommit ? `${versionName}${buildDescription !== '' ? ' - ' + buildDescription : ''}` : undefined
  // if (doVersionAndCommit) {
  //   console.log()
  //   console.log(chalk.grey(`The target version is: ${buildVersionNameWithDesc}\n`))
  // }
  // const linkToLive = (await prompts({
  //   type: 'confirm',
  //   name: 'response',
  //   message: 'Do you want this version to be live?'
  // })).response
  // if (doVersionAndCommit) console.log()
  // if (doVersionAndCommit) console.log(chalk.bold.bgBlack.rgb(255, 255, 255)(` Preparing build of ${buildVersionNameWithDesc} `))
}
