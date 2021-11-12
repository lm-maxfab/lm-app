import { render } from 'preact'
import silentLog, { printRegister } from './modules/le-monde/utils/silent-log'
import { tsvToSheetBase, SheetBase } from './modules/le-monde/utils/sheet-base'
import App from './App'

window.LM_APP_GLOBALS.print_silent_log_register = printRegister

if (window.LM_APP_GLOBALS.sheetbase_tsv) {
  silentLog('SheetBase is already loaded when app fires.')
  const sheetbase = tsvToSheetBase(window.LM_APP_GLOBALS.sheetbase_tsv)
  renderApp(sheetbase)
} else {
  silentLog('SheetBase is not loaded when app fires.')
}
document.addEventListener('lm-app_sheetbase_tsv_load_success', () => {
  silentLog('SheetBase load success event catch.')
  const sheetbase = tsvToSheetBase(window.LM_APP_GLOBALS.sheetbase_tsv)
  renderApp(sheetbase)
})
document.addEventListener('lm-app_sheetbase_tsv_load_failure', () => {
  silentLog('SheetBase load failure event catch.')
  silentLog(window.LM_APP_GLOBALS.sheetbase_tsv_load_error)
})

function renderApp (sheetBase: SheetBase): void {
  silentLog('Rendering app.')
  const appRootNode: HTMLElement|null = document.getElementById('lm-app-name')
  if (appRootNode !== null) render (<App sheetBase={sheetBase} />, appRootNode)
  else silentLog('App root node not found.')
}
