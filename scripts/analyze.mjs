import { cmd } from './_utils.mjs'

analyze()

async function analyze () {
  const shouldEmptyPreload = process.argv.find(arg => (arg === 'no-preload'))
  if (shouldEmptyPreload) await cmd('npm run raw-build -- no-preload')
  else await cmd('npm run raw-build')
  await cmd('source-map-explorer "build/assets/*.js"')
}

export default analyze
