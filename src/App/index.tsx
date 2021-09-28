import { Component, Context, JSX } from 'preact'
import clss from 'classnames'
import { SheetBase } from '../modules/spreadsheets/tsv-base-to-js-object-base'
import AppContext from '../context'
import Header from './components/Header'
import Intro from './components/Intro'
import WideArticles from './components/WideArticles'
import GridArticles from './components/GridArticles'
import Menu from './components/Menu'
import IntersectionObserver from '../modules/le-monde/components/IntersectionObserver'
import './styles.css'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  sheet_data?: SheetBase
}

class App extends Component<Props, {}> {
  mainClass: string = 'lm-app'
  static contextType: Context<any> = AppContext

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props, context } = this
    const { config } = context

    // Logic
    const fragments = [{
      url: 'http://image.com/image.jpg',
      h_position: '60%',
      height: '80%',
      width: '30%',
      paragraph_chunk: <>I am a paragraph chunk.</>
    }, {
      url: 'http://image.com/image.jpg',
      h_position: '0%',
      height: '50%',
      width: '70%',
      paragraph_chunk: <>I am a paragraph chunk.</>
    }, {
      url: 'http://image.com/image.jpg',
      h_position: '100%',
      height: '100%',
      width: '30%',
      paragraph_chunk: <>I am a paragraph chunk.</>
    }, {
      url: 'http://image.com/image.jpg',
      h_position: '20%',
      height: '90%',
      width: '45%',
      paragraph_chunk: <>I am a paragraph chunk.</>
    }, {
      url: 'http://image.com/image.jpg',
      h_position: '0%',
      height: '100%',
      width: '60%',
      paragraph_chunk: <>I am a paragraph chunk.</>
    }]

    // Classes
    const classes: string = clss(this.mainClass, props.className)
    const inlineStyle = { ...props.style }

    // Display
    return (
      <div
        id={config.project_short_name}
        className={classes}
        style={inlineStyle}>
        {/* <Header /> */}
        <IntersectionObserver callback={(e, o) => { console.log(e[0].isIntersecting) }}>
          <div>I am the child.</div>
          <div>I am the other child.</div>
          <div>I am the last child.</div>
        </IntersectionObserver>
        <Intro fragments={fragments} />
        <WideArticles />
        <GridArticles />
        <Menu />
      </div>
    )
  }
}

export type { Props }
export default App
