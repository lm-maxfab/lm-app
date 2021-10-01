import { Component, Context, JSX } from 'preact'
import clss from 'classnames'
import { SheetBase } from '../modules/sheet-base'
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

interface State {
  is_bright: boolean
}

class App extends Component<Props, State> {
  state = { is_bright: false }
  constructor (props: Props) {
    super(props)
    window.setInterval(() => {
      this.setState(curr => ({ is_bright: !curr.is_bright }))
    }, 2000)
  }

  mainClass: string = 'lm-app'
  static contextType: Context<any> = AppContext

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props, state, context } = this
    const { config } = context

    // Logic
    const fragments = [{
      url: 'http://image.com/image.jpg',
      h_position: '60%',
      height: '80%',
      width: '30%',
      paragraph_chunk: <>I am a paragraph chunk. </>
    }, {
      url: 'http://image.com/image.jpg',
      h_position: '0%',
      height: '50%',
      width: '70%',
      paragraph_chunk: <>I am a paragraph chunk. </>
    }, {
      url: 'http://image.com/image.jpg',
      h_position: '100%',
      height: '100%',
      width: '30%',
      paragraph_chunk: <>I am a paragraph chunk. </>
    }, {
      url: 'http://image.com/image.jpg',
      h_position: '20%',
      height: '90%',
      width: '45%',
      paragraph_chunk: <>I am a paragraph chunk. </>
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
        <Header
          theme={state.is_bright ? 'bright' : 'dark'} />
        <Intro
          paragraph_basis={<>Wesh alors, </>}
          fragments={fragments} />
        <WideArticles />
        <GridArticles />
        <Menu />
      </div>
    )
  }
}

export type { Props }
export default App
