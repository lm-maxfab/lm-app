import React from 'react'
import clss from 'classnames'
import './styles.css'

interface Props {
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
  highlightColor?: string
  offset?: string
}

class HighlightedText extends React.Component<Props, {}> {
  mainClass: string = 'lm-highlighted-text'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): React.ReactNode {
    const { props } = this
    const classes: string = clss(this.mainClass, props.className)
    const inlineStyle = {
      ...props.style,
      '--c-highlight': props.highlightColor,
      '--len-highlight-offset': props.offset
    }

    return (
      <span
        className={classes}
        style={inlineStyle}>
        <span className={`${this.mainClass}__inner`}>
          {props.children}
        </span>
      </span>
    )
  }
}

export type { Props }
export default HighlightedText
