import { Component, ReactNode } from 'react'
import clss from 'classnames'
import styles from './styles.module.css'

class Header extends Component<{}, {}> {
  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): ReactNode {
    return (
      <div className={clss('prenoms-head', styles.wrapper)}>
        <h1 className={styles.headline}>Le prénom des gens.</h1>
        <p className={styles.signature}>Chroniques de Baptiste Coulmont</p>
      </div>
    )
  }
}

export default Header
