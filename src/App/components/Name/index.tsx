import React from 'react'
import clss from 'classnames'
import styles from './styles.module.css'

interface Props {
  className?: string
  style?: any
  name: string
  display_name: string
  intro: string
  text: string
}

class Name extends React.Component<Props, {}> {
  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): React.ReactNode {
    const { props } = this
    const classes: string = clss('prenoms-name', styles.wrapper, props.className)
    const inlineStyle = { ...props.style }
    return (
      <div className={classes} style={inlineStyle}>
        <div>
          <span>{props.display_name}</span>
          <span>{props.intro}</span>
        </div>
        <div>
          {props.text}
        </div>
        <button>
          Lire la suite
        </button>
      </div>
    )
  }
}

export type { Props }
export default Name
