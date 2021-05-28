import React from 'react'
import clss from 'classnames'
import styles from './styles.module.css'

class Template extends React.Component<{}, {}> {
  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): React.ReactNode {
    const classes: string = clss('TEMPLATE', styles.wrapper)
    return (
      <div className={classes}>
        TSX component template.
      </div>
    )
  }
}

export default Template
