import React from 'react'
import clss from 'classnames'
import type { SheetBase } from '../modules/spreadsheets/tsv-base-to-js-object-base'
import AppContext from '../context'
import './styles.css'

import FancyHoverableText from '../modules/le-monde/components/FancyHoverableText'
import Parallax from '../modules/le-monde/components/Parallax'

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
    const mainClass = 'lm-app'
    const classes: string = clss(
      mainClass,
      props.className
    )
    const inlineStyle = { ...props.style }

    return (
      <div
        id={context.config.project_short_name}
        className={classes}
        style={inlineStyle}>
        App.
        <FancyHoverableText
          fillStartColor='blue'
          fillEndColor='limegreen'
          shadowSize='2px'
          shadowColor='blue'
          style={{ fontSize: '92px', fontWeight: 800 }}>
          Fancy<br />hover
        </FancyHoverableText>
        <Parallax render={percent => <div>{percent}</div>} />
      </div>
    )
  }
}

export type { Props }
export default App
