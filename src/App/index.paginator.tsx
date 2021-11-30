import { Component, JSX } from 'preact'
import { SheetBase } from '../modules/le-monde/utils/sheet-base'
import bem from '../modules/le-monde/utils/bem'
import getViewportDimensions from '../modules/le-monde/utils/get-viewport-dimensions'
import './styles.scss'
import Paginator, { Page } from '../modules/le-monde/components/Paginator'
import StrToHtml from '../modules/le-monde/components/StrToHtml'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  sheetBase?: SheetBase
}

interface State {
  navHeight: number
}

class App extends Component<Props, State> {
  clss: string = 'photos21'
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

    // Extract data
    const classes = bem('lm-app').block(this.clss)
    const inlineStyle: JSX.CSSProperties = {
      ...props.style,
      '--nav-height': `${state.navHeight}px`,
      padding: '64px',
      paddingTop: 'calc(var(--nav-height) + 64px)',
      position: 'relative',
      width: '100%'
    }

    // Display
    return (
      <div className={classes.value} style={inlineStyle}>
        <Paginator
          delay={50}
          intervalCheck={true}
          onPageChange={(pos) => console.log('PAGE CHANGED', pos)}>
          <div style={{ marginTop: '2000px' }}>DIV</div>
          {'text'}
          <br />
          {187}
          <br />
          {90071992547409919n}
          {Boolean(true)}
          {undefined}
          <Page value='pouet-pouet'>Pouet pouet !</Page>
          <StrToHtml content='<div style="height: 800px; background-color: blue;" name="pépé">STR TO HTML</div>' />
          <div style={{ height: '100px', background: 'violet' }}>Hihihi</div>
          <Page value='hihihih'><div style={{ height: '700px', background: 'coral' }}>Hihihi</div></Page>
          <div style={{ height: '1700px', background: 'chocolate', clear: 'both' }}>Hihihi</div>
          <div style={{ height: '400px', width: '20%', position: 'relative', display: 'block', float: 'left', background: 'crimson' }}>1</div>
          <div style={{ height: '400px', width: '20%', position: 'relative', display: 'block', float: 'left', background: 'brown' }}>2</div>
          <div style={{ height: '400px', width: '20%', position: 'relative', display: 'block', float: 'left', background: 'crimson' }}>3</div>
          <div style={{ height: '400px', width: '20%', position: 'relative', display: 'block', float: 'left', background: 'brown' }}>4</div>
          <div style={{ height: '200px', width: '20%', top: '100px', position: 'relative', display: 'block', float: 'left', background: 'crimson' }}>5</div>
          <div style={{ height: '400px', clear: 'both', background: 'yellowgreen' }}>Hihihi</div>
          <div style={{ height: '1100px', background: 'cornflowerblue' }}>Hihihi</div>
        </Paginator>
      </div>
    )
  }
}

export type { Props }
export default App
