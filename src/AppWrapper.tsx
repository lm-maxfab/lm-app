import { Component, JSX } from 'preact'
import clss from 'classnames'
import getViewportDimensions from './modules/le-monde/utils/get-viewport-dimensions'

import './styles.css'

// Get init viewport dimensions
const {
  orientation,
  display,
  ratio,
  navHeight
} = getViewportDimensions()

// AppWrapper state interface
interface AppWrapperProps { workEnv: string }

interface AppWrapperState {
  viewportOrientation: string|null
  viewportDisplay: string|null
  viewportRatio: string|null
  navHeight: number|undefined
}

// AppWrapper
class AppWrapper extends Component<AppWrapperProps, AppWrapperState> {
  mainClass: string = 'lm-app-wrapper'
  state: AppWrapperState = {
    viewportOrientation: orientation,
    viewportDisplay: display,
    viewportRatio: ratio,
    navHeight: navHeight
  }
  resizeTimeout1: number|null = null
  resizeInterval: number|null = null
  $root: HTMLDivElement|null = null

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR
   * * * * * * * * * * * * * * */
  constructor (props: AppWrapperProps) {
    super(props)
    this.storeViewportDimensions = this.storeViewportDimensions.bind(this)
  }

  /* * * * * * * * * * * * * * *
   * DID MOUNT
   * * * * * * * * * * * * * * */
  componentDidMount (): void {
    this.storeViewportDimensions()
    window.addEventListener('resize', this.storeViewportDimensions)
    this.resizeTimeout1 = window.setTimeout(this.storeViewportDimensions, 300)
    this.resizeInterval = window.setInterval(this.storeViewportDimensions, 2000)
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
    if (this.resizeTimeout1 !== null) window.clearTimeout(this.resizeTimeout1)
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
    const { props, state } = this
    const { workEnv } = props

    // Define CSS classes
    const workEnvClass = `${this.mainClass}_env-${workEnv}`
    const orientationClass = `${this.mainClass}_vpo-${state.viewportOrientation}`
    const displayClass = `${this.mainClass}_vpd-${state.viewportDisplay}`
    const ratioClass = `${this.mainClass}_vpr-${state.viewportRatio}`
    const classes = clss(
      this.mainClass,
      workEnvClass,
      orientationClass,
      displayClass,
      ratioClass
    )

    // Display
    return (
      <div className={classes} ref={node => { this.$root = node }}>
        {props.children}
      </div>
    )
  }
}

export default AppWrapper
export type { AppWrapperState }
