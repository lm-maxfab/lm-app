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
    const inlineStyle = {
      ...props.style,
      fontSize: 'clamp(18px, calc(2 * var(--vw)), 40px)',
      lineHeight: 1.75,
      padding: 'clamp(32px, calc(8.33 * var(--vw)), 120px)',
      marginTop: 'var(--len-nav-height)'
    }

    return (
      <div
        id={config.project_short_name}
        className={classes}
        style={inlineStyle}>
        <p style={{ fontFamily: 'var(--ff-the-antiqua-b)', fontWeight: 500, fontStyle: 'normal' }}>The Antiqua B, 500, normal</p>
        <p style={{ fontFamily: 'var(--ff-the-antiqua-b)', fontWeight: 500, fontStyle: 'italic' }}>The Antiqua B, 500, italic</p>
        <p style={{ fontFamily: 'var(--ff-the-antiqua-b)', fontWeight: 700, fontStyle: 'normal' }}>The Antiqua B, 700, normal</p>
        <p style={{ fontFamily: 'var(--ff-the-antiqua-b)', fontWeight: 700, fontStyle: 'italic' }}>The Antiqua B, 700, italic</p>
        <p style={{ fontFamily: 'var(--ff-the-antiqua-b)', fontWeight: 800, fontStyle: 'normal' }}>The Antiqua B, 800, normal</p>
        <p style={{ fontFamily: 'var(--ff-marr-sans)', fontWeight: 400, fontStyle: 'normal' }}>Marr Sans, 400, normal</p>
        <p style={{ fontFamily: 'var(--ff-marr-sans)', fontWeight: 500, fontStyle: 'normal' }}>Marr Sans, 500, normal</p>
        <p style={{ fontFamily: 'var(--ff-marr-sans)', fontWeight: 600, fontStyle: 'normal' }}>Marr Sans, 600, normal</p>
        <p style={{ fontFamily: 'var(--ff-marr-sans)', fontWeight: 700, fontStyle: 'normal' }}>Marr Sans, 700, normal</p>
        <p style={{ fontFamily: 'var(--ff-marr-sans-condensed)', fontWeight: 500, fontStyle: 'normal' }}>Marr Sans, 500, normal</p>
        <p style={{ fontFamily: 'var(--ff-marr-sans-condensed)', fontWeight: 600, fontStyle: 'normal' }}>Marr Sans, 600, normal</p>
        <p style={{ fontFamily: 'var(--ff-marr-sans-condensed)', fontWeight: 700, fontStyle: 'normal' }}>Marr Sans, 700, normal</p>
        <p style={{ fontFamily: 'var(--ff-fette-engschrift)', fontWeight: 500, fontStyle: 'normal' }}>Fette Engschrift, 500, normal</p>
      </div>
    )
  }
}

export type { Props }
export default App
