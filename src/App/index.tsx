import { Component, Context, JSX, VNode } from 'preact'
import clss from 'classnames'
import { SheetBase } from '../modules/sheet-base'
import AppContext from '../context'
import Header from './components/Header'
import Intro from './components/Intro'
import Home from './components/Home'
import WideArticles from './components/WideArticles'
import GridArticles from './components/GridArticles'
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
  mainClass: string = 'lm-app'
  state: State = {
    show_intro_paragraph: true,
    activate_home: false
  }

  static contextType: Context<any> = AppContext

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props, state, context } = this
    const { config } = context

    // Extract data
    const sheetBase = props.sheet_data ?? new SheetBase()
    // const fragments = sheetBase.collection('fragments').value as unknown as Fragment[]
    const introImages = sheetBase.collection('intro_images').value as unknown as IntroImage[]
    const homeImages = sheetBase.collection('home_images').value as unknown as HomeImage[]
    const pageSettings = sheetBase.collection('page_settings').entry('settings').value as unknown as PageSettings
    const introFirstParagraphChunk = pageSettings.intro_first_paragraph_chunk

    // Logic
    const introPassedDetector = (ioe: IOE|null) => this.setState({ show_intro_paragraph: !(ioe?.isIntersecting ?? false) })
    const homeDetector = (ioe: IOE|null) => this.setState({ activate_home: ioe?.isIntersecting ?? false })

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
        <IOComponent
          threshold={[0, .1, .2, .3, .4, .5, .6, .7, .8, .9, 1]}
          callback={introPassedDetector}>
          <IOComponent
            className='frag-home-wrapper'
            threshold={[.15]}
            callback={homeDetector}>
            <Home
              images={homeImages}
              activate={state.activate_home} />
          </IOComponent>
          <WideArticles />
          <GridArticles />
        </IOComponent>
        <Menu />
      </div>
    )
  }
}

export type { Props }
export default App
