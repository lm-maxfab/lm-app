import { render } from 'preact'
import Longform from './apps/Longform'
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
}
