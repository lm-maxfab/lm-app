import appsNodes from './app'
import getConfig from './modules/le-monde/utils/get-config'
import fetchSheetBase from './modules/le-monde/utils/fetch-sheet-base'
import renderLMApp from './modules/le-monde/utils/render-lm-app'

init()

async function init () {
  const config = getConfig()
  if (config === undefined) throw new Error('Could not load config, app rendering stops.')

  const env = config.env ?? 'production'
  if (config.env === undefined) console.warn(`config.env is not defined, defaulting to 'production'`)

  const spreadsheetsUrls = config.spreadsheets_urls
  if (spreadsheetsUrls === undefined) throw new Error('config.spreadsheets_urls is not defined, app rendering stops.')

  const spreadsheetUrl = spreadsheetsUrls[env] ?? ''

  const sheetBase = spreadsheetUrl !== ''
    ? await fetchSheetBase(spreadsheetUrl)
    : undefined

  renderLMApp(appsNodes, sheetBase)
}

/* Attach some utils to window */

if (window.LM_APP === undefined) window.LM_APP = {}

window.LM_APP.getConfig = getConfig
window.LM_APP.fetchSheetBase = fetchSheetBase
window.LM_APP.renderLMApp = renderLMApp
window.LM_APP.init = init
