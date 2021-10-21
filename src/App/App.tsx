import { Component, JSX } from 'preact'
import clss from 'classnames'
import { SheetBase } from '../modules/le-monde/utils/sheet-base'
import './app.css'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  sheetBase?: SheetBase
}

class App extends Component<Props, {}> {
  mainClass: string = 'lm-app'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    // Extract data
    const classes: string = clss(this.mainClass)
    const inlineStyle: JSX.CSSProperties = { ...props.style }

    // Display
    return (
      <div className={classes} style={inlineStyle}>LM App.</div>
    )
  }
}

export type { Props }
export default App
