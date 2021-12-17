import { render } from 'preact'
import Longform from './apps/Longform'
import Footer from './apps/Footer'
import SideSnippet from './apps/SideSnippet'
import silentLog from './modules/le-monde/utils/silent-log'
import { tsvToSheetBase } from './modules/le-monde/utils/sheet-base'

window.LM_APP_RENDERER = renderApp
document.dispatchEvent(new CustomEvent('LMAppLoaded'))

function renderApp (sheetBaseTsv?: string): void {
  silentLog('Rendering app.')
  const sheetBase = sheetBaseTsv !== undefined ? tsvToSheetBase(sheetBaseTsv) : undefined

  const longformAppRootNode: HTMLCollectionOf<Element> = document.getElementsByClassName('lm-app-root-longform')
  if (longformAppRootNode.length === 0) silentLog('Longform root node not found.')
  else {
    [...longformAppRootNode].forEach(node => {
      render(<Longform sheetBase={sheetBase} />, node)
    })
  }

  const footerAppRootNode: HTMLCollectionOf<Element> = document.getElementsByClassName('lm-app-root-footer')
  if (footerAppRootNode.length === 0) silentLog('Footer root node not found.')
  else {
    [...footerAppRootNode].forEach(node => {
      render(<Footer sheetBase={sheetBase} />, node)
    })
  }

  const sideSnippetAppRootNode: HTMLCollectionOf<Element> = document.getElementsByClassName('lm-app-root-side-snippet')
  if (sideSnippetAppRootNode.length === 0) silentLog('SideSnippet root node not found.')
  else {
    [...sideSnippetAppRootNode].forEach(node => {
      render(<SideSnippet sheetBase={sheetBase} />, node)
    })
  }
}
