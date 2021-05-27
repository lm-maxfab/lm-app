import { Component, ReactNode, FunctionComponent as FC } from 'react'
import clss from 'classnames'
import styles from './styles.module.css'
import Header from './components/Header'
import Intro from './components/Intro'
import Names from './components/Names'

const GoNext: FC = props => {
  return <div>Go Next !</div>
}

class App extends Component<{}, {}> {
  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): ReactNode {
    const classes: string = clss('prenoms', styles.wrapper)
    return (
      <div className={classes}>
        <Header />
        <Intro />
        <Names />
        <GoNext />
      </div>
    )
  }
}

export default App
