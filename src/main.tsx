import { render } from 'preact'
import SilentLog from './modules/le-monde/utils/silent-log'
import { SheetBase, tsvToSheetBase } from './modules/le-monde/utils/sheet-base'
import renderList from './apps/rendered'

const silentLogger = new SilentLog()
window.LM_APP_SILENT_LOGGER = silentLogger

cronFetchAndRender()

function getConfig () {
  const configPre = document.documentElement.querySelector('#lm-app-config')
  if (configPre === null) throw new Error('#lm-app-config is missing in page.')
  try {
    const config = JSON.parse(configPre.innerHTML) as Config
    silentLogger.log('#lm-app-config content parsed:\n', config)
    return config
  } catch (error) {
    silentLogger.log('#lm-app-config content could not be parsed:\n', configPre.innerHTML)
    throw error
  }
}

async function fetchSheetBase () {
  const config = getConfig()
  const { env } = config
  const sheetbaseUrl = config.sheetbases[env] || ''
  if (sheetbaseUrl === '') return undefined
  try {
    const res = await window.fetch(sheetbaseUrl)
    if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`)
    const tsv = await res.text()
    const sheetBase = tsvToSheetBase(tsv)
    silentLogger.log('Received sheetbase:\n', tsv, sheetBase)
    return sheetBase
  } catch (error) {
    silentLogger.log('Error while fetching sheetbase:\n', error)
    throw error
  }
}

function renderApp (sheetBase?: SheetBase): void {
  // DELETE HEADER
  const headerSelectors = '.Header__nav-container, #Header, .multimediaNav'
  const headerElements = [...document.querySelectorAll(headerSelectors)]
  headerElements.forEach(element => element.remove())

  silentLogger.log('Start rendering apps...')  
  renderList.map(toRender => {
    const { app: App, rootNodeClass } = toRender
    silentLogger.log(`Rendering ${App.wrapped.name} in .${rootNodeClass} ...`)
    const rootNodes: HTMLCollectionOf<Element> = document.getElementsByClassName(rootNodeClass)
    for (const rootNode of rootNodes) {
      render(<App sheetBase={sheetBase} />, rootNode)
    }
    if (rootNodes.length == 0) silentLogger.log('No node found to render', App.wrapped.name)
    else silentLogger.log(`Rendered ${App.wrapped.name} in ${rootNodes.length} nodes.`)
  })
}

async function fetchAndRender () {
  const sheetBase = await fetchSheetBase()
  renderApp(sheetBase)
}

async function cronFetchAndRender (step = 0) {
  try {
    await fetchAndRender()
  } catch (error) {
    silentLogger.log(error)
    if (step >= 5) return silentLogger.log('Could not fetch sheetbase in 5 attemps, stop retrying.')
    silentLogger.log('Something went wrong while fetching sheetBase, new try in 500ms.')
    window.setTimeout(() => { cronFetchAndRender(step + 1) }, 500)
  }
}
