import { render } from 'preact'
import 'whatwg-fetch'
import smoothscroll from 'smoothscroll-polyfill'
import preload from './preload'
import config from './config.json'
import getHeaderElement from './modules/le-monde/utils/get-header-element'
import silentLog, { getRegister, printRegister } from './modules/le-monde/utils/silent-log'
import { fetchTsv, tsvToSheetBase, SheetBase } from './modules/sheet-base'
import Wrapper from './AppWrapper'
import Longform from './App/longform'
import SnippetHead from './App/snippet-head'
import SnippetFoot from './App/snippet-foot'

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
  const workEnv = process.env.NODE_ENV ?? 'undefined'
  const wrapperProps = { workEnv }

  // const demoRootNode: HTMLElement|null = document.getElementById('lm-app-demo-root')
  // if (demoRootNode !== null) {
  //   render(
  //     <Wrapper {...wrapperProps}>
  //     </Wrapper>,
  //     demoRootNode
  //   )
  // }

  // Longform
  const longformRootNode: HTMLElement|null = document.getElementById('lm-app-longform-root')
  if (longformRootNode !== null) {
    render(
      <Wrapper
        {...wrapperProps}
        app={Longform}
        appProps={{ sheetBase }} />,
      longformRootNode
    )
  } else {
    silentLog('no longform root node found.')
  }

  // Snippet head
  const snippetHeadRootNode: HTMLElement|null = document.getElementById('lm-app-snippet-head-root')
  if (snippetHeadRootNode !== null) {
    render(
      <Wrapper
        {...wrapperProps}
        app={SnippetHead}
        appProps={{
          sheetBase,
          currentFragmentId: config.custom_config.current_fragment_id
        }} />,
      snippetHeadRootNode
    )
  } else {
    silentLog('no snippet head root node found.')
  }
  
  // Snippet foot
  const snippetFootRootNode: HTMLElement|null = document.getElementById('lm-app-snippet-foot-root')
  if (snippetFootRootNode !== null) {
    render(
      <Wrapper
        {...wrapperProps}
        app={SnippetFoot}
        appProps={{
          sheetBase,
          currentFragmentId: config.custom_config.current_fragment_id
        }} />,
      snippetFootRootNode
    )
  } else {
    silentLog('no snippet foot root node found.')
  }
}

// const preloadedSheetBase = tsvToSheetBase(preload)
// renderApp(preloadedSheetBase)
fetchTsv(config.sheetbase_url)
  .then(tsv => renderApp(tsvToSheetBase(tsv)))
  .catch(err => console.warn(err))
