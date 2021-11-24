import { Component, JSX } from 'preact'
import { SheetBase } from '../modules/le-monde/utils/sheet-base'
import bem, { BEM } from '../modules/le-monde/utils/bem'
import getViewportDimensions from '../modules/le-monde/utils/get-viewport-dimensions'
import Slider from './components/Slider'
import './styles.css'
import { SlideData } from './types'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  sheetBase?: SheetBase
}

interface State {
  navHeight: number
}

class App extends Component<Props, State> {
  bem: BEM = bem('lm-app').block('fraude')
  updateNavHeightInterval: number|null = null
  updateNavHeightTimeout: number|null = null
  state: State = {
    navHeight: 0
  }

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
    this.updateNavHeight = this.updateNavHeight.bind(this)
  }

  /* * * * * * * * * * * * * * *
   * LIFE CYCLE
   * * * * * * * * * * * * * * */
  componentDidMount () {
    window.addEventListener('resize', this.updateNavHeight)
    this.updateNavHeightTimeout = window.setTimeout(this.updateNavHeight, 20)
    this.updateNavHeightInterval = window.setInterval(this.updateNavHeight, 1000)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.updateNavHeight)
    if (this.updateNavHeightTimeout !== null) window.clearTimeout(this.updateNavHeightTimeout)
    if (this.updateNavHeightInterval !== null) window.clearInterval(this.updateNavHeightInterval)
  }

  /* * * * * * * * * * * * * * *
   * METHODS
   * * * * * * * * * * * * * * */
  updateNavHeight () {
    this.setState(curr => {
      const { navHeight } = getViewportDimensions()
      return curr.navHeight !== navHeight ? { navHeight } : null
    })
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props, state } = this

    // Logic
    const slides: SlideData[] = (props.sheetBase?.collection('slides').value ?? []) as unknown as SlideData[]

    // Extract data
    const classes = this.bem.block(props.className)
    const inlineStyle: JSX.CSSProperties = {
      ...props.style,
      '--nav-height': `${state.navHeight}px`,
      paddingTop: 'var(--nav-height)'
    }

    // Display
    return (
      <div className={classes.value} style={inlineStyle}>
        <Slider data={slides} />
      </div>
    )
  }
}

export type { Props }
export default App
