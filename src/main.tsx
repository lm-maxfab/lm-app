import { render } from 'preact'
import 'whatwg-fetch'
import smoothscroll from 'smoothscroll-polyfill'
import config from './config.json'
import getHeaderElement from './modules/le-monde/utils/get-header-element'
import silentLog, { getRegister, printRegister } from './modules/le-monde/utils/silent-log'
import { fetchTsv, tsvToSheetBase, SheetBase } from './modules/le-monde/utils/sheet-base'
import Wrapper from './AppWrapper'
import Longform from './App/App'

// Init globals
window.__LM_GET_SILENT_LOG_REGISTER = getRegister
window.__LM_PRINT_SILENT_LOG_REGISTER = printRegister

// Enable smoothscroll polyfill
smoothscroll.polyfill()

// Hide or remove header if config.json wants it
if (config.delete_header === true) getHeaderElement()?.remove()
else if (config.hide_header === true) (getHeaderElement()?.style ?? { display: 'block' }).display = 'none'

// App rendering
function renderApp (sheetBase: SheetBase): void {
  // Longform
  const longformRootNode: HTMLElement|null = document.getElementById('lm-app-longform-root')
  if (longformRootNode !== null) {
    render(
      <Wrapper
        app={Longform}
        appProps={{ sheetBase }} />,
      longformRootNode
    )
  } else {
    silentLog('no longform root node found.')
  }
}

if (window.__LM_GLOBAL_SNIPPET_TSV_PRELOAD !== undefined) {
  const preloadedSheetBase = tsvToSheetBase(window.__LM_GLOBAL_SNIPPET_TSV_PRELOAD)
  window.__LM_GLOBAL_SHEET_BASE = preloadedSheetBase
  silentLog('preloaded sheet base:', window.__LM_GLOBAL_SHEET_BASE)
  renderApp(preloadedSheetBase)
}
fetchTsv(config.sheetbase_url)
  .then(tsv => {
    const loadedSheetBase = tsvToSheetBase(tsv)
    window.__LM_GLOBAL_SHEET_BASE = loadedSheetBase
    silentLog('loaded sheet base:', window.__LM_GLOBAL_SHEET_BASE)
    renderApp(loadedSheetBase)
  })
  .catch(err => console.warn(err))
