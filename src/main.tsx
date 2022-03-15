import appsNodes from './app'
import fetchSheetBase from './modules/utils/fetch-sheet-base'
import getConfig from './lm-app-modules/utils/get-config'
import renderLMApp from './lm-app-modules/utils/render-app'

/* Init */
init()
  .then(() => {})
  .catch(() => {})

/* Attach some utils to window */
if (window.LM_APP === undefined) window.LM_APP = {}
window.LM_APP.getConfig = getConfig
window.LM_APP.fetchSheetBase = fetchSheetBase
window.LM_APP.renderLMApp = renderLMApp
window.LM_APP.init = init

async function init (): Promise<void> {
  // Read config in DOM (injected on `npm run dev` or `npm run build`)
  const config = getConfig()
  if (config === undefined) throw new Error('Could not load config, app rendering stops.')
  const env = config.env ?? 'production'
  if (config.env === undefined) console.warn('config.env is not defined, defaulting to \'production\'')
  const spreadsheetsUrls = config.spreadsheets_urls
  if (spreadsheetsUrls === undefined) throw new Error('config.spreadsheets_urls is not defined, app rendering stops.')
  const spreadsheetUrl = spreadsheetsUrls[env] ?? ''

  // Fetch spreadsheet
  const sheetBase = spreadsheetUrl !== '' ? await fetchSheetBase(spreadsheetUrl) : undefined
  if (window.LM_APP === undefined) window.LM_APP = {}
  window.LM_APP.sheetBase = sheetBase

  // Render apps
  renderLMApp(appsNodes, sheetBase)
}
