import { Component, JSX } from 'preact'
import './styles.scss'
import Intro from './components/Intro'
import { SheetBase } from '../modules/le-monde/utils/sheet-base'
import bem, { BEM } from '../modules/le-monde/utils/bem'
import getViewportDimensions from '../modules/le-monde/utils/get-viewport-dimensions'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  sheetBase?: SheetBase
}

class App extends Component<Props, {}> {
  bem: BEM = bem('lm-app')

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    // Logic
    const { navHeight } = getViewportDimensions()
    console.log(props.sheetBase)

    // Assign classes
    const classes = this.bem.block(props.className)
    const inlineStyle: JSX.CSSProperties = {
      ...props.style,
      '--nav-height': `${navHeight}px`,
      marginTop: 'var(--nav-height)'
    }

    // Display
    return (
      <div className={classes.toString()} style={inlineStyle}>
        <Intro />
      </div>
    )
  }
}

export type { Props }
export default App
