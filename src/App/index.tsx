import React from 'react'
import clss from 'classnames'
import styles from './styles.module.css'
import Header from './components/Header'
import Intro from './components/Intro'
import Names from './components/Names'
import GoNext from './components/GoNext'

interface Props {
  className?: string
  style?: any
}

class App extends React.Component<Props, {}> {
  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): React.ReactNode {
    const { props } = this
    const classes: string = clss('lm-app', 'prenoms', styles['app'], props.className)
    const inlineStyle = { ...props.style }
    return (
      <div className={classes} style={inlineStyle}>
        <Header className={styles['header']} />
        <Intro className={styles['intro']} />
        <Names className={styles['names']} />
        <GoNext className={styles['go-next']} />
      </div>
    )
  }
}

export type { Props }
export default App
