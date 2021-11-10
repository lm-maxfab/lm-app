import prompts from 'prompts'

const statusesOrder = ['alpha', 'beta', 'rc', 'stable']

const promptsVersionTypeOptions = {
  type: 'select',
  name: 'type',
  message: 'What kind of new version is it?',
  initial: 0,
  choices: [
    { title: 'Build', value: 'build' },
    { title: 'Status', value: 'status' },
    { title: 'Patch', value: 'patch' },
    { title: 'Minor', value: 'minor' },
    { title: 'Major', value: 'major' },
    { title: 'Let me name it myself', value: 'self-named' }
  ]
}

const promptsVersionMajorOptions = {
  type: 'number',
  name: 'major',
  message: 'Major number ?'
}

const promptsVersionMinorOptions = {
  type: 'number',
  name: 'minor',
  message: 'Minor number ?'
}

const promptsVersionPatchOptions = {
  type: 'number',
  name: 'patch',
  message: 'Patch number ?'
}

const promptsVersionStatusOptions = {
  type: 'select',
  name: 'status',
  message: 'Status name ?',
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
  message: 'Build number ?'
}

export const initialVersion = {
  major: 0,
  minor: 0,
  patch: 0,
  status: 'stable',
  build: 0
}

export function latestVersionIn (buildsInfo = []) {
  const majorNb = Math.max(...buildsInfo.map(build => build.version.major))
  const majors = buildsInfo.filter(build => build.version.major === majorNb)
  const minorNb = Math.max(...majors.map(build => build.version.minor))
  const minors = majors.filter(build => build.version.minor === minorNb)
  const patchNb = Math.max(...minors.map(build => build.version.patch))
  const patchs = minors.filter(build => build.version.patch === patchNb)
  const statusName = patchs.map(build => build.version.status).sort().slice(-1)[0]
  const statuses = patchs.filter(build => build.version.status === statusName)
  const buildNb = Math.max(...statuses.map(build => build.version.build))
  const builds = statuses.filter(build => build.version.build === buildNb)
  const build = builds[0]
  return build?.version
}

export async function promptTargetVersionFrom (buildVersion) {
  const newVersionType = (await prompts(promptsVersionTypeOptions)).type

  if (newVersionType === 'self-named') {
    const newVersionPrompts = await prompts([
      promptsVersionMajorOptions,
      promptsVersionMinorOptions,
      promptsVersionPatchOptions,
      promptsVersionStatusOptions,
      promptsVersionBuildOptions
    ])
    return newVersionPrompts

  } else if (newVersionType === 'build') {
    return { ...buildVersion, build: buildVersion.build + 1 }

  } else if (newVersionType === 'status') {
    const currentStatusPos = statusesOrder.indexOf(buildVersion.status)
    if (currentStatusPos === statusesOrder.length - 1) return { ...buildVersion, build: buildVersion.build + 1 }
    else return { ...buildVersion, status: statusesOrder[currentStatusPos + 1], build: 0 }

  } else if (newVersionType === 'patch') {
    const newVersionStatusPrompts = await prompts(promptsVersionStatusOptions)
    return { ...buildVersion, patch: buildVersion.patch + 1, status: newVersionStatusPrompts.status, build: 0 }

  } else if (newVersionType === 'minor') {
    const newVersionStatusPrompts = await prompts(promptsVersionStatusOptions)
    return { ...buildVersion, minor: buildVersion.minor + 1, patch: 0, status: newVersionStatusPrompts.status, build: 0 }

  } else if (newVersionType === 'major') {
    const newVersionStatusPrompts = await prompts(promptsVersionStatusOptions)
    return { major: buildVersion.major + 1, minor: 0, patch: 0, status: newVersionStatusPrompts.status, build: 0 }
  }
}

export function versionToString (version) {
  const { major, minor, patch, status, build } = version
  return `v${major}.${minor}.${patch}-${status}-${build}`
}
