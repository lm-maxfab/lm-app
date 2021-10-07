import { Component, Context, JSX, VNode } from 'preact'
import clss from 'classnames'
import { SheetBase } from '../modules/sheet-base'
import AppContext from '../context'
import Header from './components/Header'
import Intro from './components/Intro'
import Home from './components/HomePage'
import WideFragments from './components/WideFragments'
import GridFragments from './components/GridFragments'
import Menu from './components/Menu'
import IOComponent from '../modules/le-monde/components/IntersectionObserver'
import { Fragment, IntroImage, HomeImage, PageSettings } from './types'
import './styles.css'

type IOE = IntersectionObserverEntry

interface Props {
  className?: string
  style?: JSX.CSSProperties
  sheet_data?: SheetBase
}

interface State {
  show_intro_paragraph: boolean
  activate_home: boolean
}

class App extends Component<Props, State> {
  #isMounted: boolean = false
  mainClass: string = 'lm-app'
  state: State = {
    show_intro_paragraph: true,
    activate_home: false
  }

  static contextType: Context<any> = AppContext

  componentDidMount () {
    this.#isMounted = true
  }

  componentWillUnmount () {
    this.#isMounted = false
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props, state, context } = this
    const { config } = context

    // Extract data
    const sheetBase = props.sheet_data ?? new SheetBase()
    const fragments = sheetBase.collection('fragments').value as unknown as Fragment[]
    const wideFragments = fragments.filter(fragment => fragment.display === 'wide')
    const gridFragments = fragments.filter(fragment => fragment.display === 'grid')
    const introImages = sheetBase.collection('intro_images').value as unknown as IntroImage[]
    const homeImages = sheetBase.collection('home_images').value as unknown as HomeImage[]
    const pageSettings = sheetBase.collection('page_settings').entry('settings').value as unknown as PageSettings
    const introFirstParagraphChunk = pageSettings.intro_first_paragraph_chunk

    // Logic
    const introPassedDetector = (ioe: IOE|null) => {
      if (!this.#isMounted) return
      const scrollLevel = window.scrollY
      const documentHeight = document.body.clientHeight
      const scrollRatio = scrollLevel / documentHeight
      const mostOfPageIsScrolled = scrollRatio > .7
      const restIsIntersecting = ioe?.isIntersecting ?? false
      const showIntroParagraph = !mostOfPageIsScrolled && !restIsIntersecting
      this.setState({ show_intro_paragraph: showIntroParagraph })
    }
    const homeDetector = (ioe: IOE|null) => {
      if (!this.#isMounted) return
      this.setState({ activate_home: ioe?.isIntersecting ?? false })
    }

    // Classes
    const classes: string = clss(this.mainClass, props.className)
    const inlineStyle = { ...props.style }

    // Display
    return (
      <div
        className={classes}
        style={inlineStyle}
        id={config.project_short_name}>
        <Header theme='dark' />
        <Intro
          show_paragraph={state.show_intro_paragraph}
          paragraph_basis={introFirstParagraphChunk}
          images={introImages} />
        <Home
          images={homeImages}
          isVisible={state.activate_home}
          activate={state.activate_home} />
        <IOComponent
          threshold={0}
          callback={introPassedDetector}>
          <IOComponent
            className='frag-home-wrapper'
            threshold={0}
            callback={homeDetector}>
            <div className={`${this.mainClass}__home-scrolling-area`} />
          </IOComponent>
          <WideFragments
            fragments={wideFragments} />
          <GridFragments
            fragments={gridFragments} />
        </IOComponent>
        <Menu />
      </div>
    )
  }
}

export type { Props }
export default App
