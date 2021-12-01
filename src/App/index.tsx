import { Component, JSX } from 'preact'
import { SheetBase } from '../modules/le-monde/utils/sheet-base'
import bem from '../modules/le-monde/utils/bem'
import getViewportDimensions from '../modules/le-monde/utils/get-viewport-dimensions'
import Nav from './components/Nav'
import Home from './components/Home'
import Intro from './components/Intro'
import Months from './components/Months'
import Credits from './components/Credits'
import './styles.scss'
import {
  CreditsContentData,
  HomeImageData,
  ImageBlockData,
  IntroParagraphData,
  MonthData
} from './types'
import Paginator, { Page } from '../modules/le-monde/components/Paginator'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  sheetBase?: SheetBase
}

interface State {
  navHeight: number
  currentPageData: any
  currentMonth: string|undefined
}

class App extends Component<Props, State> {
  $Months: Months|null = null
  clss: string = 'photos21'
  updateNavHeightInterval: number|null = null
  updateNavHeightTimeout: number|null = null
  state: State = {
    navHeight: 0,
    currentPageData: undefined,
    currentMonth: undefined
  }

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
    this.updateNavHeight = this.updateNavHeight.bind(this)
    this.handleMonthChange = this.handleMonthChange.bind(this)
    this.scrollToMonth = this.scrollToMonth.bind(this)
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

  handleMonthChange (val?: string) {
    this.setState({ currentMonth: val })
  }

  scrollToMonth (monthId: string) {
    if (this.$Months === null) return
    this.$Months.scrollToMonth(monthId)
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props, state } = this

    // Logic
    const data = props.sheetBase
    const homeImages = (data?.collection('home_images').value ?? []) as unknown as HomeImageData[]
    const introParagraphs = (data?.collection('intro_paragraphs').value ?? []) as unknown as IntroParagraphData[]
    const imageBlocks = (data?.collection('image_blocks').value ?? []) as unknown as ImageBlockData[]
    const months = (data?.collection('months').value ?? []) as unknown as MonthData[]
    const creditsContent = (data?.collection('credits_content').entry('1').value ?? { id: '1', content: <></> }) as unknown as CreditsContentData

    // Extract data
    const classes = bem('lm-app')
      .block(this.clss)
      .mod({
        ['show-nav']: Array.isArray(state.currentPageData) && state.currentPageData.includes('show-nav'),
        ['hide-nav']: !(Array.isArray(state.currentPageData) && state.currentPageData.includes('show-nav'))
      })
    const inlineStyle: JSX.CSSProperties = {
      ...props.style,
      '--nav-height': `${state.navHeight}px`,
      paddingTop: 'var(--nav-height)'
    }

    // Display
    return (
      <div className={classes.value} style={inlineStyle}>
        <Nav
          data={months}
          current={state.currentMonth}
          dispatchMonthButtonClick={this.scrollToMonth}
          className={bem(this.clss).elt('nav').value} />
        <Paginator
          delay={100}
          triggerBound='top'
          onPageChange={val => this.setState({ currentPageData: val })}>
          <Page value={['hide-nav']}>
            <Home
              className={bem(this.clss).elt('home').value}
              images={homeImages} />
          </Page>
          <Page value={['hide-nav']}>
            <Intro
              className={bem(this.clss).elt('intro').value}
              paragraphs={introParagraphs} />
          </Page>
          <Page value={['show-nav']}>
            <Months
              ref={(node: Months) => { this.$Months = node }}
              className={bem(this.clss).elt('months').value}
              months={months}
              blocks={imageBlocks}
              dispatchMonthChange={this.handleMonthChange} />
          </Page>
          <Page value={['hide-nav']}>
            <Credits
              className={bem(this.clss).elt('credits').value}
              content={creditsContent.content} />
          </Page>
        </Paginator>
      </div>
    )
  }
}

export type { Props }
export default App
