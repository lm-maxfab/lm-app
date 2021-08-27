import React from 'react'
import clss from 'classnames'
import type { SheetBase } from '../modules/spreadsheets/tsv-base-to-js-object-base'
import AppContext from '../context'
import './styles.css'

interface Props {
  className?: string
  style?: React.CSSProperties
  sheet_data?: SheetBase
}

class App extends React.Component<Props> {
  static contextType = AppContext

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): React.ReactNode {
    const { props, context } = this
    const { config } = context
    const mainClass = 'lm-app'
    const classes: string = clss(
      mainClass,
      props.className
    )
    const inlineStyle = { ...props.style }

    const navHeight = context.nav_height

    return (
      <div
        id={config.project_short_name}
        className={classes}
        style={inlineStyle}>
        <strong>App.</strong>
        <br />
        Nav height: {navHeight}px
      </div>
    )
  }
}

export type { Props }
export default App
