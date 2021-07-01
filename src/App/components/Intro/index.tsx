import { Component, ReactNode } from 'react'
import clss from 'classnames'
import styles from './styles.module.css'

interface Props {
  className?: string
  style?: React.CSSProperties
  text?: JSX.Element
}

class Intro extends Component<Props, {}> {
  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): ReactNode {
    const { props } = this
    const classes: string = clss('prenoms-intro', styles['wrapper'], props.className)
    const inlineStyle = { ...props.style }

    return (
      <div className={classes} style={inlineStyle}>
        {props.text}
      </div>
    )
  }
}

export type { Props }
export default Intro
