import React from 'react'
import clss from 'classnames'
import type { SheetBase } from '../modules/spreadsheets/tsv-base-to-js-object-base'
import Carousel from '../modules/le-monde/components/Carousel'
import AppContext from '../context'
import './styles.css'

interface Props {
  className?: string
  style?: React.CSSProperties
  sheet_data?: SheetBase
}

class App extends React.Component<Props> {
  static contextType = AppContext
  mainClass: string = 'lm-app'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): React.ReactNode {
    const { props, context } = this
    const { config } = context
    const classes: string = clss(
      this.mainClass,
      props.className
    )
    const inlineStyle = {
      ...props.style,
      marginTop: 'var(--len-nav-height)'
    }

    return (
      <div
        id={config.project_short_name}
        className={classes}
        style={inlineStyle}>
        <Carousel>
          <div style={{ background: 'coral', width: 'calc(90 * var(--vw))', height: 'calc(10 * var(--vh))' }}>Fake page<br/>lorem ipsum dolor<br/>sit amet<br/>tortor</div>
          <div style={{ background: 'aliceblue', width: 'calc(90 * var(--vw))', height: 'calc(10 * var(--vh))' }}>Fake page 2<br/>lorem ipsum dolor<br/>sit amet<br/>tortor</div>
          <div style={{ background: 'coral', width: 'calc(90 * var(--vw))', height: 'calc(10 * var(--vh))' }}>Fake page 3<br/>lorem ipsum dolor<br/>sit amet<br/>tortor</div>
          <div style={{ background: 'aliceblue', width: 'calc(90 * var(--vw))', height: 'calc(10 * var(--vh))' }}>Fake page 4<br/>lorem ipsum dolor<br/>sit amet<br/>tortor</div>
        </Carousel>
      </div>
    )
  }
}

export type { Props }
export default App
