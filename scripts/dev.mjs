import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { Directory } from './modules/file-system/index.mjs'

dev()
async function dev () {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const ROOT = new Directory(path.join(__dirname, '../'))
  const CONFIG_JSON = await ROOT.get('config.json')
  const config = JSON.parse(await CONFIG_JSON.read())
  const configWithEnv = {
    ...config,
    env: 'developpment'
  }
  const strConfig = JSON.stringify(configWithEnv, null, 2).split('\n').join('\n  ')
  const STATIC_DEV_SCRIPTS_CONFIG_JS = await ROOT.get('static/dev/scripts/inject-config.js')
  await STATIC_DEV_SCRIPTS_CONFIG_JS.editQuiet(() => {
    const comment = '/* Generated via /scripts/dev.mjs */\n'
    const code = `!(() => {
  const configPre = document.documentElement.querySelector('#lm-app-config')
  if (configPre === null) return
  const innerText = JSON.stringify(${strConfig})
  configPre.innerText = innerText
})();\n`
    return comment + code
  })
}
