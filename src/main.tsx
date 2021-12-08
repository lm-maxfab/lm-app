import { render } from 'preact'
import SilentLog from './modules/le-monde/utils/silent-log'
import { tsvToSheetBase } from './modules/le-monde/utils/sheet-base'
import renderList from './apps/rendered'

const silentLogger = new SilentLog()
window.LM_APP_SILENT_LOGGER = silentLogger

window.LM_APP_RENDERER = renderApp
document.dispatchEvent(new CustomEvent('LMAppLoaded'))

function renderApp (sheetBaseTsv?: string): void {
  silentLogger.log('start rendering apps...')
  const sheetBase = sheetBaseTsv !== undefined ? tsvToSheetBase(sheetBaseTsv) : undefined
  
  renderList.map(toRender => {
    const { app: App, rootNodeClass } = toRender
    silentLogger.log('rendering', App.wrapped.name, 'in', `.${rootNodeClass} ...`)
    const rootNodes: HTMLCollectionOf<Element> = document.getElementsByClassName(rootNodeClass)
    for (const rootNode of rootNodes) render(<App sheetBase={sheetBase} />, rootNode)
    if (rootNodes.length == 0) silentLogger.log('no node found to render', App.wrapped.name)
    else silentLogger.log('rendered', App.wrapped.name, 'in', rootNodes.length, 'nodes')
  })
}
