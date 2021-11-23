import { render } from 'preact'
import App from './App'
import silentLog from './modules/le-monde/utils/silent-log'
import { tsvToSheetBase } from './modules/le-monde/utils/sheet-base'

window.LM_APP_RENDERER = renderApp
document.dispatchEvent(new CustomEvent('LMAppLoaded'))

function renderApp (sheetBaseTsv?: string): void {
  silentLog('Rendering app.')
  const sheetBase = sheetBaseTsv !== undefined ? tsvToSheetBase(sheetBaseTsv) : undefined
  const appRootNode: HTMLElement|null = document.getElementById('lm-app-name')
  if (appRootNode === null) silentLog('App root node not found.')
  else render(<App sheetBase={sheetBase} />, appRootNode)
}
