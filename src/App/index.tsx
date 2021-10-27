import { Component, JSX } from 'preact'
import { SheetBase } from '../modules/le-monde/utils/sheet-base'
import './styles.css'
import Sequencer from '../modules/le-monde/components/Sequencer'
import bem, { BEM } from '../modules/le-monde/utils/bem'

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

    // Extract data
    const classes = this.bem.block(props.className).value
    const inlineStyle: JSX.CSSProperties = {
      ...props.style,
      marginTop: 'var(--len-nav-height)'
    }

    // Display
    return (
      <div className={classes} style={inlineStyle}>
        <div>ACTIONS.</div>
        <Sequencer />
      </div>
    )
  }
}

export type { Props }
export default App
