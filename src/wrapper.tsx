import { Component } from 'preact'
import { SheetBase } from './modules/le-monde/utils/sheet-base'
import getViewportDimensions, { ViewportDimensions } from './modules/le-monde/utils/get-viewport-dimensions'
import GroupDelay from './modules/le-monde/utils/group-delay'
import bem from './modules/le-monde/utils/bem'
import './wrapper.scss'

interface Props {
  sheetBase?: SheetBase
}

interface InjectedProps {
  className: string
  style: JSX.CSSProperties
  sheetBase: SheetBase
  viewportDimensions: ViewportDimensions
}

interface State {
  viewportDimensions: ViewportDimensions|null
}

// [WIP] remove any and get something smarter
function wrapper (Wrapped: any) {
  return class Wrapper extends Component<Props, State> {
    static clss: string = 'lm-app'
    static wrapped = Wrapped
    clss = Wrapper.clss
    timeouts: number[] = []
    intervals: number[] = []
    state: State = {
      viewportDimensions: null
    }

    /* * * * * * * * * * * * * * *
     * CONSTRUCTOR & LIFECYCLE
     * * * * * * * * * * * * * * */
    constructor (props: Props) {
      super(props)
      this.setViewportDimensions = this.setViewportDimensions.bind(this)
      this.groupDelayedSetViewportDimensions()
      this.timeouts.push(window.setTimeout(this.groupDelayedSetViewportDimensions, 100))
      this.timeouts.push(window.setTimeout(this.groupDelayedSetViewportDimensions, 200))
      this.timeouts.push(window.setTimeout(this.groupDelayedSetViewportDimensions, 400))
      this.intervals.push(window.setInterval(this.groupDelayedSetViewportDimensions, 2000))
      window.addEventListener('resize', this.groupDelayedSetViewportDimensions)
      document.addEventListener('scroll', this.groupDelayedSetViewportDimensions)
    }
  
    componentDidMount () {
      this.groupDelayedSetViewportDimensions()
    }
  
    componentDidUpdate () {
      this.groupDelayedSetViewportDimensions()
    }
  
    componentWillUnmount () {
      this.timeouts.forEach(timeout => window.clearTimeout(timeout))
      this.intervals.forEach(interval => window.clearInterval(interval))
      window.removeEventListener('resize', this.groupDelayedSetViewportDimensions)
      document.removeEventListener('scroll', this.groupDelayedSetViewportDimensions)
    }
  
    /* * * * * * * * * * * * * * *
     * METHODS
     * * * * * * * * * * * * * * */
    setViewportDimensions () {
      const dimensions = getViewportDimensions()
      this.setState(curr => {
        if (curr.viewportDimensions?.display !== dimensions.display
          || curr.viewportDimensions.height !== dimensions.height
          || curr.viewportDimensions.width !== dimensions.width
          || curr.viewportDimensions.ratio !== dimensions.ratio
          || curr.viewportDimensions.orientation !== dimensions.orientation
          || curr.viewportDimensions.navHeight !== dimensions.navHeight) {
          return {
            ...curr,
            viewportDimensions: dimensions   
          }
        } else return null
      })
    }

    groupDelayedSetViewportDimensions = new GroupDelay(
      this.setViewportDimensions.bind(this),
      100
    ).call
  
    /* * * * * * * * * * * * * * *
     * RENDER
     * * * * * * * * * * * * * * */
    render () {
      const { props, state } = this
      const wrapperClasses = bem(this.clss).mod({
        ['env-dev']: process.env.NODE_ENV === 'development',
        ['env-prod']: process.env.NODE_ENV === 'production'
      })
      const wrapperNavHeightVar = `${state.viewportDimensions?.navHeight ?? 0}px`
      const wrapperStyle: JSX.CSSProperties = { '--len-nav-height': wrapperNavHeightVar }
      return <Wrapped
        className={wrapperClasses.value}
        style={wrapperStyle}
        sheetBase={props.sheetBase}
        viewportDimensions={state.viewportDimensions} />
    }
  }
}

export type { Props, InjectedProps, State }
export default wrapper
