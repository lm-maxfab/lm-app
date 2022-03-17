import appsNodes from './apps'
import fetchSheetBase from './modules/utils/fetch-sheet-base'
import getConfig, { ConfigLayout } from './lm-app-modules/utils/get-config'
import getPageSettings from './lm-app-modules/utils/get-page-settings'
import applyPageTemplate from './lm-app-modules/utils/apply-page-template'
import applyPageLayout from './lm-app-modules/utils/apply-page-layout'
import renderLMApp from './lm-app-modules/utils/render-app'

/* Init */
init()
  .then(() => {})
  .catch(() => {})

/* Attach some utils to window */
if (window.LM_APP === undefined) window.LM_APP = {}
window.LM_APP.getConfig = getConfig
window.LM_APP.getPageSettings = getPageSettings
window.LM_APP.applyPageTemplate = applyPageTemplate
window.LM_APP.applyPageLayout = applyPageLayout
window.LM_APP.fetchSheetBase = fetchSheetBase
window.LM_APP.renderLMApp = renderLMApp
window.LM_APP.init = init

async function init (): Promise<void> {
  // Read config in DOM (injected on `npm run dev` or `npm run build`)
  const config = getConfig()
  if (config === undefined) throw new Error('Could not load config, app rendering stops.')

  // Get settings from window.location.search
  const settings = getPageSettings()

  // Detect env via config & settings in order to choose which spreadsheet to load
  const env = settings?.env === 'production'
    || settings?.env === 'staging'
    || settings?.env === 'testing'
    || settings?.env === 'developpment'
    ? settings.env
    : config.env ?? 'production'
  if (settings?.env === undefined && config.env === undefined) console.warn('config.env and settings?.env are not defined, defaulting to \'production\'')
  const urls = config.spreadsheets_urls
  if (urls === undefined) throw new Error('config.spreadsheets_urls is not defined, app rendering stops.')
  const url = urls[env] ?? ''

  // Fetch spreadsheet
  const sheetBase = url !== '' ? await fetchSheetBase(url) : undefined
  if (window.LM_APP === undefined) window.LM_APP = {}
  window.LM_APP.sheetBase = sheetBase

  // Apply page template in dev
  if (window.location.hostname === 'localhost') {
    const template = settings?.template ?? 'article'
    await applyPageTemplate(template)
  }

  // Apply page layout in dev
  if (window.location.hostname === 'localhost') {
    const layouts = config.layouts
    const layout: ConfigLayout|undefined = layouts.find(layout => layout.name === settings?.layout) ?? layouts[0]
    if (layout !== undefined) applyPageLayout(layout)
  }
  
  // Render apps
  renderLMApp(appsNodes, sheetBase)
}
