import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { Directory } from './modules/file-system/index.mjs'

dev()
async function dev () {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const ROOT = new Directory(path.join(__dirname, '../'))
  const CONFIG_JSON = await ROOT.get('config.json')
  const config = JSON.parse(await CONFIG_JSON.read())
  const configWithEnv = { ...config, env: 'developpment' }
  const strConfig = JSON.stringify(configWithEnv)
  const INDEX_HTML = await ROOT.get('index.html')
  await INDEX_HTML.editHTMLQuiet(jsdom => {
    const document = jsdom.window.document.documentElement
    const configPre = document.querySelector('.lm-app-config')
    configPre.innerHTML = strConfig
  })
  await INDEX_HTML.prettifyHTMLQuiet()
}
