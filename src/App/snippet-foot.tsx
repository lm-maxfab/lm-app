import { Component, JSX } from 'preact'
import clss from 'classnames'
import { SheetBase } from '../modules/sheet-base'
import './snippet-foot.css'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  sheetBase?: SheetBase
  currentFragmentId?: string
}

class App extends Component<Props, {}> {
  mainClass: string = 'lm-app-fragments-snippet-foot'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    // Classes
    const classes: string = clss(this.mainClass, props.className)
    const inlineStyle = { ...props.style }

    // Display
    return (
      <div className={classes} style={inlineStyle}>
        Snippet foot.
      </div>
    )
  }
}

export type { Props }
export default App
