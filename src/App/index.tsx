import { Component, Context, JSX } from 'preact'
import clss from 'classnames'
import { SheetBase } from '../modules/spreadsheets/tsv-base-to-js-object-base'
import AppContext from '../context'
import Header from './components/Header'
import Intro from './components/Intro'
import WideArticles from './components/WideArticles'
import GridArticles from './components/GridArticles'
import Menu from './components/Menu'
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

    // Classes
    const classes: string = clss(this.mainClass, props.className)
    const inlineStyle = {
      ...props.style,
      marginTop: 'var(--len-nav-height)'
    }

    // Display
    return (
      <div
        id={config.project_short_name}
        className={classes}
        style={inlineStyle}>
        <Header />
        <Intro />
        <WideArticles />
        <GridArticles />
        <Menu />
      </div>
    )
  }
}

export type { Props }
export default App
