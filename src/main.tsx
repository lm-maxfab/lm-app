import { render } from 'preact'
import SilentLog from './modules/le-monde/utils/silent-log'
import { SheetBase, tsvToSheetBase } from './modules/le-monde/utils/sheet-base'
import renderList from './apps/rendered'
import config from '../config'

const silentLogger = new SilentLog()
window.LM_APP_SILENT_LOGGER = silentLogger

cronFetchAndRender(0)

function renderApp (sheetBase?: SheetBase): void {
  silentLogger.log('start rendering apps...')
  renderList.map(toRender => {
    const { app: App, rootNodeClass } = toRender
    silentLogger.log(`rendering ${App.wrapped.name} in .${rootNodeClass} ...`)
    const rootNodes: HTMLCollectionOf<Element> = document.getElementsByClassName(rootNodeClass)
    for (const rootNode of rootNodes) render(<App sheetBase={sheetBase} />, rootNode)
    if (rootNodes.length == 0) silentLogger.log(`no node found to render ${App.wrapped.name}`)
    else silentLogger.log(`rendered ${App.wrapped.name} in ${rootNodes.length} nodes`)
  })
}

async function fetchSheetBase () {
  const { env } = config
  const sheetbaseUrl = config.sheetbases[env] || ''
  if (sheetbaseUrl === '') return undefined
  try {
    const res = await window.fetch(sheetbaseUrl)
    if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`)
    const tsv = await res.text()
    const sheetBase = tsvToSheetBase(tsv)
    silentLogger.log('Received sheetbase', tsv, sheetBase)
    return sheetBase
  } catch (error) {
    silentLogger.log('Error while fetching sheetbase', error)
    throw error
  }
}

async function fetchAndRender () {
  const sheetBase = await fetchSheetBase()
  renderApp(sheetBase)
}

async function cronFetchAndRender (step = 0) {
  try {
    await fetchAndRender()
  } catch (error) {
    if (step < 5) {
      silentLogger.log('Something went wrong while fetching sheetBase, retry in 500ms')
      window.setTimeout(() => {
        cronFetchAndRender(step + 1)
      }, 500)
    } else {
      silentLogger.log('Could not fetch sheetbase in 5 attemps, stop retrying.')
    }
  }
}
