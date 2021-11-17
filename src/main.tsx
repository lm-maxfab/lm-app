import { render } from 'preact'
import App from './App'
import silentLog, { printRegister } from './modules/le-monde/utils/silent-log'
import { tsvToSheetBase, SheetBase } from './modules/le-monde/utils/sheet-base'

// window.LM_APP_GLOBALS.print_silent_log_register = printRegister

if (window.LM_APP_SHEETBASE !== undefined
  && window.LM_APP_SHEETBASE.data !== null) {
  silentLog('SheetBase is already loaded when app fires.')
  const sheetbase = tsvToSheetBase(window.LM_APP_SHEETBASE.data)
  renderApp(sheetbase)
} else {
  silentLog('SheetBase is not loaded when app fires.')
}

document.addEventListener('LMAppSheetBaseLoaded', () => {
  silentLog('SheetBase load success event catch.')
  if (window.LM_APP_SHEETBASE.data !== null) {
    const sheetbase = tsvToSheetBase(window.LM_APP_SHEETBASE.data)
    renderApp(sheetbase)
  }
})

document.addEventListener('LMAppSheetBaseLoadFailed', () => {
  silentLog('SheetBase load failure event catch.')
  silentLog(window.LM_APP_SHEETBASE.error)
})

function renderApp (sheetBase: SheetBase): void {
  silentLog('Rendering app.')
  const appRootNode: HTMLElement|null = document.getElementById('lm-app-name')
  if (appRootNode !== null) render (<App sheetBase={sheetBase} />, appRootNode)
  else silentLog('App root node not found.')
}
