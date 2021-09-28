import { Component, JSX } from 'preact'
import clss from 'classnames'
import 'whatwg-fetch'
import smoothscroll from 'smoothscroll-polyfill'

import Spreadsheet from './modules/spreadsheets/Spreadsheet'
import type { SheetBase } from './modules/spreadsheets/tsv-base-to-js-object-base'
import getViewportDimensions from './modules/le-monde/utils/get-viewport-dimensions'
import getHeaderNode from './modules/le-monde/utils/get-header-node'

import AppContext from './context'
import preload from './preload'
import config from './config.json'
import App from './App'
import './styles.css'

// Enable smoothscroll polyfill
smoothscroll.polyfill()

// Hide or remove header if config.json wants it
if (config.delete_header === true) {
  const $header = getHeaderNode()
  $header?.remove()
} else if (config.hide_header === true) {
  const $header = getHeaderNode()
  if ($header) $header.style.display = 'none'
}

// Get init viewport dimensions
const {
  orientation,
  display,
  ratio,
  navHeight
} = getViewportDimensions()

// AppWrapper state interface
interface AppWrapperState {
  viewportOrientation: string|null
  viewportDisplay: string|null
  viewportRatio: string|null
  navHeight: number|undefined
}

// AppWrapper
class AppWrapper extends Component<{}, AppWrapperState> {
  mainClass: string = 'lm-app-wrapper'
  state = {
    viewportOrientation: orientation,
    viewportDisplay: display,
    viewportRatio: ratio,
    navHeight: navHeight
  }
  resizeInterval: number|null = null
  $root: HTMLDivElement|null = null

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR
   * * * * * * * * * * * * * * */
  constructor (props: {}) {
    super(props)
    this.storeViewportDimensions = this.storeViewportDimensions.bind(this)
  }

  /* * * * * * * * * * * * * * *
   * DID MOUNT
   * * * * * * * * * * * * * * */
  componentDidMount (): void {
    this.storeViewportDimensions()
    window.addEventListener('resize', this.storeViewportDimensions)
    this.resizeInterval = window.setInterval(this.storeViewportDimensions, 500)
  }

  /* * * * * * * * * * * * * * *
   * DID UPDATE
   * * * * * * * * * * * * * * */
  componentDidUpdate (): void {
    this.storeViewportDimensions()
  }

  /* * * * * * * * * * * * * * *
   * WILL UNMOUNT
   * * * * * * * * * * * * * * */
  componentWillUnmount (): void {
    window.removeEventListener('resize', this.storeViewportDimensions)
    if (this.resizeInterval !== null) window.clearInterval(this.resizeInterval)
  }

  /* * * * * * * * * * * * * * *
   * STORE VIEWPORT DIMENSIONS
   * * * * * * * * * * * * * * */
  storeViewportDimensions (): void {
    const { width, height, orientation, display, ratio, navHeight } = getViewportDimensions()
    this.$root?.style.setProperty('--vw', `calc(${width}px / 100)`)
    this.$root?.style.setProperty('--vh', `calc(${height}px / 100)`)
    this.$root?.style.setProperty('--len-nav-height', `${navHeight ?? 0}px`)
    this.setState((current: AppWrapperState): AppWrapperState|null => {
      const hasChanged = current.viewportOrientation !== orientation
        || current.viewportDisplay !== display
        || current.viewportRatio !== ratio
        || current.navHeight !== navHeight
      if (!hasChanged) return null
      return {
        viewportOrientation: orientation,
        viewportDisplay: display,
        viewportRatio: ratio,
        navHeight: navHeight
      }
    })
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { state } = this

    // Logic
    const workEnv = process.env.NODE_ENV
    const userEnv = window.location.href.match(/apps.([a-z]+-)?lemonde.fr/) !== null ? 'aec' : 'web'

    // Passed context
    const context = {
      config,
      env: workEnv,
      user_env: userEnv,
      viewport: {
        orientation: state.viewportOrientation,
        display: state.viewportDisplay,
        ratio: state.viewportRatio
      },
      nav_height: state.navHeight
    }

    // Define CSS classes
    const envClass = `${this.mainClass}_env-${workEnv ?? 'undefined'}`
    const userEnvClass = `${this.mainClass}_usrenv-${userEnv}`
    const orientationClass = `${this.mainClass}_vpo-${state.viewportOrientation}`
    const displayClass = `${this.mainClass}_vpd-${state.viewportDisplay}`
    const ratioClass = `${this.mainClass}_vpr-${state.viewportRatio}`
    const classes = clss(
      this.mainClass,
      envClass,
      userEnvClass,
      orientationClass,
      displayClass,
      ratioClass
    )

    // Display
    return (
      <div
        className={classes}
        ref={node => { this.$root = node }}>
        <Spreadsheet
          url={config.sheetbase_url}
          preload={preload}
          render={(sheetData: SheetBase) => (
            <AppContext.Provider value={{ ...context, sheet_data: sheetData }}>
              <App sheet_data={sheetData} />
            </AppContext.Provider>
          )} />
      </div>
    )
  }
}

export default AppWrapper
export type { AppWrapperState }
