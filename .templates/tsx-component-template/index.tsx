import React from 'react'
import clss from 'classnames'
import './styles.css'

interface Props {
  className?: string
  style?: React.CSSProperties
}

class Template extends React.Component<Props, {}> {
  mainClass: string = 'TEMPLATE'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): React.ReactNode {
    const { props } = this
    const classes: string = clss(this.mainClass, props.className)
    const inlineStyle = { ...props.style }
    
    return (
      <div className={classes} style={inlineStyle}>
        TSX component template.
      </div>
    )
  }
}

export type { Props }
export default Template
