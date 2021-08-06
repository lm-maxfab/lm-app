import React from 'react'
import clss from 'classnames'
import './styles.css'

interface Props {
  className?: string
  style?: React.CSSProperties
}

class Template extends React.Component<Props, {}> {
  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): React.ReactNode {
    const { props } = this
    const mainClass = 'TEMPLATE'
    const classes: string = clss(mainClass, props.className)
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
