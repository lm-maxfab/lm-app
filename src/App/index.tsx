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
    const classes: string = clss('lm-app', 'prenoms', styles.wrapper, props.className)
    const inlineStyle = { ...props.style }
    return (
      <div className={classes} style={inlineStyle}>
        <Header />
        <Intro />
        <Names />
        <GoNext />
      </div>
    )
  }
}

export type { Props }
export default App
