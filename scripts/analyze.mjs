import { cmd } from './_utils.mjs'

analyze()

async function analyze () {
  await cmd('npm run raw-build')
  await cmd('source-map-explorer "build/assets/*.js"')
}

export default analyze
