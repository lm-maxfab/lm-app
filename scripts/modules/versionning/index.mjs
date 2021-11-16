import prompts from 'prompts'

const statusesOrder = ['alpha', 'beta', 'rc', 'stable']

const promptsVersionTypeOptions = {
  type: 'select',
  name: 'type',
  message: 'Version type:',
  initial: 0,
  choices: [
    { title: 'Build', value: 'build' },
    { title: 'Status', value: 'status' },
    { title: 'Patch', value: 'patch' },
    { title: 'Minor', value: 'minor' },
    { title: 'Major', value: 'major' },
    { title: 'Let me name it myself', value: 'self-named' }
  ],
  validate: value => {
    console.log('validate.')
    console.log(value)
  }
}

const promptsVersionMajorOptions = {
  type: 'number',
  name: 'major',
  message: 'Major number:'
}

const promptsVersionMinorOptions = {
  type: 'number',
  name: 'minor',
  message: 'Minor number:'
}

const promptsVersionPatchOptions = {
  type: 'number',
  name: 'patch',
  message: 'Patch number:'
}

const promptsVersionStatusOptions = {
  type: 'select',
  name: 'status',
  message: 'Status name:',
  initial: 3,
  choices: [
    { title: 'Alpha', value: 'alpha' },
    { title: 'Beta', value: 'beta' },
    { title: 'Release-Candidate', value: 'rc' },
    { title: 'Stable', value: 'stable' }
  ]
}

const promptsVersionBuildOptions = {
  type: 'number',
  name: 'build',
  message: 'Build number:'
}

export const initialVersion = {
  major: 0,
  minor: 0,
  patch: 0,
  status: 'stable',
  build: 0
}

export function latestVersionIn (buildsInfo = []) {
  const majorNb = Math.max(...buildsInfo.map(build => build.version.major).filter(val => typeof val === 'number'))
  const majors = buildsInfo.filter(build => build.version.major === majorNb)
  const minorNb = Math.max(...majors.map(build => build.version.minor).filter(val => typeof val === 'number'))
  const minors = majors.filter(build => build.version.minor === minorNb)
  const patchNb = Math.max(...minors.map(build => build.version.patch).filter(val => typeof val === 'number'))
  const patchs = minors.filter(build => build.version.patch === patchNb)
  const statusName = patchs.map(build => build.version.status).filter(val => typeof val === 'string').sort().slice(-1)[0]
  const statuses = patchs.filter(build => build.version.status === statusName)
  const buildNb = Math.max(...statuses.map(build => build.version.build).filter(val => typeof val === 'number'))
  const builds = statuses.filter(build => build.version.build === buildNb)
  const build = builds[0]

  console.log('majorNb:', majorNb)
  console.log('majors:', majors)
  console.log('minorNb:', minorNb)
  console.log('minors:', minors)
  console.log('patchNb:', patchNb)
  console.log('patchs:', patchs)
  console.log('statusName:', statusName)
  console.log('statuses:', statuses)
  console.log('buildNb:', buildNb)
  console.log('builds:', builds)
  console.log('build:', build)

  return build?.version
}

export async function promptTargetVersionFrom (buildVersion) {
  const newVersionType = (await prompts(promptsVersionTypeOptions)).type
  if (newVersionType === undefined) throw new Error('The version type field is required.')

  let returned = {}

  if (newVersionType === 'self-named') {
    const { major, minor, patch, status, build } = await prompts([
      promptsVersionMajorOptions,
      promptsVersionMinorOptions,
      promptsVersionPatchOptions,
      promptsVersionStatusOptions,
      promptsVersionBuildOptions
    ])

    if (major === undefined) throw new Error('The major field is required.')
    if (minor === undefined) throw new Error('The minor field is required.')
    if (patch === undefined) throw new Error('The patch field is required.')
    if (status === undefined) throw new Error('The status field is required.')
    if (build === undefined) throw new Error('The build field is required.')
    return { major, minor, patch, status, build }

  } else if (newVersionType === 'build') {
    return {
      ...buildVersion,
      build: buildVersion.build + 1
    }

  } else if (newVersionType === 'status') {
    const currentStatusPos = statusesOrder.indexOf(buildVersion.status)
    if (currentStatusPos === statusesOrder.length - 1) {
      return { 
        ...buildVersion,
        build: buildVersion.build + 1
      }
    }
    else {
      return {
        ...buildVersion,
        status: statusesOrder[currentStatusPos + 1],
        build: 0
      }
    }

  } else if (newVersionType === 'patch') {
    const { status } = await prompts(promptsVersionStatusOptions)
    if (status === undefined) throw new Error('The status field is required.')
    return {
      ...buildVersion,
      patch: buildVersion.patch + 1,
      status,
      build: 0
    }

  } else if (newVersionType === 'minor') {
    const { status } = await prompts(promptsVersionStatusOptions)
    if (status === undefined) throw new Error('The status field is required.')
    return {
      ...buildVersion,
      minor: buildVersion.minor + 1,
      patch: 0,
      status,
      build: 0
    }

  } else if (newVersionType === 'major') {
    const { status } = await prompts(promptsVersionStatusOptions)
    if (status === undefined) throw new Error('The status field is required.')
    return {
      major: buildVersion.major + 1,
      minor: 0,
      patch: 0,
      status,
      build: 0
    }
  }

}

export function versionToString (version) {
  const { major, minor, patch, status, build } = version
  return `v${major}.${minor}.${patch}-${status}-${build}`
}
