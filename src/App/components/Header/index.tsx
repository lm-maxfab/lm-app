import { Component, ReactNode } from 'react'
import clss from 'classnames'
import styles from './styles.module.css'

interface Props {
  className?: string
  style?: any
}

class Header extends Component<Props, {}> {
  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): ReactNode {
    const { props } = this
    const classes: string = clss('prenoms-head', styles['wrapper'], props.className)
    const inlineStyle = { ...props.style }

    return (
      <div className={classes} style={inlineStyle}>
        <h1 className={styles['headline']}>
          <span className={styles['headline-first-line']}>Le</span>
          <span className={styles['headline-second-line']}>prénom</span>
          <span className={styles['headline-third-line']}>des gens.</span>
        </h1>
        <p className={styles['signature']}>Chroniques de Baptiste Coulmont</p>
      </div>
    )
  }
}

export type { Props }
export default Header
