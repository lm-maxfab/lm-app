import { Component, JSX } from 'preact'
import bem from '../../modules/le-monde/utils/bem'
import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
}

class Template extends Component<Props, {}> {
  clss = 'TEMPLATE'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Classes and style */
    const wrapperClasses = bem(props.className ?? '').block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    /* Display */
    return (
      <div className={wrapperClasses.value} style={wrapperStyle}>
        TSX component template.
      </div>
    )
  }
}

export type { Props }
export default Template
