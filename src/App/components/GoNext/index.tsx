import React from 'react'
import clss from 'classnames'
import styles from './styles.module.css'

interface Props {
  className?: string
  style?: React.CSSProperties
}

class GoNext extends React.Component<Props, {}> {
  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): React.ReactNode {
    const { props } = this
    const classes: string = clss('prenoms-go-next', styles.wrapper, props.className)
    const inlineStyle = { ...props.style }
    return (
      <button className={classes} style={inlineStyle}>
        Go next.
      </button>
    )
  }
}

export type { Props }
export default GoNext
