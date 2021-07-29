import React from 'react'
import { render, hydrate } from 'react-dom'
import clss from 'classnames'
import 'whatwg-fetch'
import smoothscroll from 'smoothscroll-polyfill'
import Spreadsheet from './modules/spreadsheets/Spreadsheet'
import type { SheetBase } from './modules/spreadsheets/tsv-base-to-js-object-base'
import config from './config'
import AppContext from './context'
import preload from './preload'

// Enable smoothscroll polyfill
smoothscroll.polyfill()

// Select DOM root node for the React app
const rootNodeId: string = 'lm-app-root'
const rootNode: HTMLElement|null = document.getElementById(rootNodeId)

interface AppProps {
  data: any
}

class App extends React.Component<AppProps> {
  render () {
    const { props } = this
    console.log(props)
    return <div>Longform app.</div>
  }
}

// Rendered app
class LmApp extends React.Component {
  static contextType = AppContext

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): React.ReactNode {
    const isInApp = window.location.href.match(/apps.([a-z]+-)?lemonde.fr/)
    const envClass = isInApp ? 'lm-app_aec' : 'lm-app_web'
    const classes = clss('lm-app', envClass)
    const context = {}
    return (
      <React.StrictMode>
        <AppContext.Provider value={context}>
          <div className={classes}>
            <h1>My app.</h1>
            <p><strong>Config:</strong></p>
            <pre>{JSON.stringify(config, null, 2)}</pre>
            <p><strong>Context:</strong></p>
            <pre>{JSON.stringify(context, null, 2)}</pre>
            <Spreadsheet
              preload={preload}
              url={config.sheetbase_url}
              render={(data: SheetBase) => <App data={data} />} />
          </div>
        </AppContext.Provider>
      </React.StrictMode>
    )
  }
}

// Render app
if (rootNode === null) console.error(`App root node '#${rootNodeId}' not found.`)
else if (rootNode.hasChildNodes()) hydrate(<LmApp />, rootNode)
else render(<LmApp />, rootNode)
