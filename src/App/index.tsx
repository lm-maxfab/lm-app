import React from 'react'
import clss from 'classnames'
import styles from './styles.module.css'

interface Props {
  className?: string
  style?: React.CSSProperties
}

class App extends React.Component<Props> {
  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): React.ReactNode {
    const { props } = this
    
    const classes: string = clss('lm-app', 'prenoms', styles['app'], props.className)
    const inlineStyle = { ...props.style }

    return <div
      className={classes}
      style={inlineStyle} />
  }
}

export type { Props }
export default App
