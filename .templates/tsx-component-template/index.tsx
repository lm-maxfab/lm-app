import { Component, JSX } from 'preact'
import clss from 'classnames'
import './styles.css'

interface Props {
  className?: string
  style?: JSX.CSSProperties
}

class Template extends Component<Props, {}> {
  _mainClass: string = 'TEMPLATE'
  get mainClass () { return this._mainClass }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this
    const classes = clss(this._mainClass, props.className)
    const inlineStyle: JSX.CSSProperties = { ...props.style }

    return (
      <div className={classes} style={inlineStyle}>
        TSX component template.
      </div>
    )
  }
}

export type { Props }
export default Template
