import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { Directory } from './modules/file-system/index.mjs'

predev()
async function predev () {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const ROOT = new Directory(path.join(__dirname, '../'))
  const CONFIG_JSON = await ROOT.get('config.json')
  const config = JSON.parse(await CONFIG_JSON.read())
  const configWithEnv = {
    ...config,
    env: 'developpment'
  }
  const STATIC_DEV_SCRIPTS_CONFIG_JS = await ROOT.get('static/dev/scripts/config.js')
  await STATIC_DEV_SCRIPTS_CONFIG_JS.editQuiet(() => {
    const comment = '/* Generated via /scripts/predev.mjs */\n'
    const variable = `window.LM_APP_CONFIG = ${JSON.stringify(configWithEnv, null, 2)}\n`
    const dispatcher = `document.dispatchEvent(new CustomEvent('LMAppConfigJsonLoaded'))\n`
    return comment + variable + dispatcher
  })
}
