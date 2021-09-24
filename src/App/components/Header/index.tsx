import { Component, JSX } from 'preact'
import clss from 'classnames'
import './styles.css'

interface Props {
  className?: string
  style?: JSX.CSSProperties
}

class Template extends Component<Props, {}> {
  mainClass: string = 'TEMPLATE'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
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
