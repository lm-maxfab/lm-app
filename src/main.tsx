import { render } from 'preact'
import 'whatwg-fetch'
import smoothscroll from 'smoothscroll-polyfill'
// import preload from './preload'
import config from './config.json'
import getHeaderElement from './modules/le-monde/utils/get-header-element'
import silentLog, { getRegister, printRegister } from './modules/le-monde/utils/silent-log'
import { fetchTsv, tsvToSheetBase, SheetBase } from './modules/sheet-base'
import Wrapper from './AppWrapper'
// import Longform from './App/longform'
import SnippetHead from './App/snippet-head'
import SnippetParagraph from './App/snippet-paragraph'
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

  // // Longform
  // const longformRootNode: HTMLElement|null = document.getElementById('lm-app-longform-root')
  // if (longformRootNode !== null) {
  //   render(
  //     <Wrapper
  //       {...wrapperProps}
  //       app={Longform}
  //       appProps={{ sheetBase }} />,
  //     longformRootNode
  //   )
  // } else {
  //   silentLog('no longform root node found.')
  // }

  // Snippet head
  const snippetHeadRootNode: HTMLElement|null = document.getElementById('lm-app-snippet-head-root')
  if (snippetHeadRootNode !== null) {
    render(
      <Wrapper
        {...wrapperProps}
        app={SnippetHead}
        appProps={{
          sheetBase,
          currentFragmentId: window.__LM_GLOBAL_SNIPPET_ID
        }} />,
      snippetHeadRootNode
    )
  } else {
    silentLog('no snippet head root node found.')
  }

  // Snippet paragraph
  const snippetParagraphRootNode: HTMLElement|null = document.getElementById('lm-app-snippet-paragraph-root')
  if (snippetParagraphRootNode !== null) {
    render(
      <Wrapper
        {...wrapperProps}
        app={SnippetParagraph}
        appProps={{ sheetBase }} />,
      snippetParagraphRootNode
    )
  } else {
    silentLog('no snippet paragraph root node found.')
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
          currentFragmentId: window.__LM_GLOBAL_SNIPPET_ID
        }} />,
      snippetFootRootNode
    )
  } else {
    silentLog('no snippet foot root node found.')
  }
}

if (window.__LM_GLOBAL_SNIPPET_TSV_PRELOAD !== undefined) {
  const preloadedSheetBase = tsvToSheetBase(window.__LM_GLOBAL_SNIPPET_TSV_PRELOAD)
  window.__LM_GLOBAL_SHEET_BASE = preloadedSheetBase
  console.log('preloadedSheetBase', window.__LM_GLOBAL_SHEET_BASE)
  renderApp(preloadedSheetBase)
}
fetchTsv(config.sheetbase_url)
  .then(tsv => {
    const loadedSheetBase = tsvToSheetBase(tsv)
    window.__LM_GLOBAL_SHEET_BASE = loadedSheetBase
    console.log('loadedSheetBase', window.__LM_GLOBAL_SHEET_BASE)
    renderApp(loadedSheetBase)
  })
  .catch(err => console.warn(err))
