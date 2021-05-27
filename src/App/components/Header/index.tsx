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
        <div className={styles.headline}>
          Le prénom des gens.
        </div>
        <div className={styles.signature}>
          Chroniques de Baptiste Coulmont
        </div>
      </div>
    )
  }
}

export default Header
