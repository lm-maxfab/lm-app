import { Component, JSX } from 'preact'
import clss from 'classnames'
import { PageSettings } from './types'
import { SheetBase } from '../modules/sheet-base'
import './snippet-paragraph.css'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  sheetBase?: SheetBase
}

class App extends Component<Props, {}> {
  mainClass: string = 'lm-app-fragments-snippet-paragraph'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    // Classes
    const classes: string = clss(this.mainClass, props.className)
    const inlineStyle = { ...props.style }
    
    const sheetBase = props.sheetBase ?? new SheetBase()
    const pageSettings = sheetBase.collection('page_settings').entry('settings').value as unknown as PageSettings
    const paragraph = pageSettings.snippet_paragraph_content

    // Display
    return (
      <div
        className={classes}
        style={inlineStyle}>
        {paragraph}
      </div>
    )
  }
}

export type { Props }
export default App
