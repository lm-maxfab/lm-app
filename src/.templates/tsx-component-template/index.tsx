import { Component, JSX } from 'preact'
import bem, { BEM } from '../../modules/le-monde/utils/bem'
import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
}

class Template extends Component<Props, {}> {
  bem: BEM = bem('TEMPLATE')

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this
    const classes = this.bem.block(props.className)
    const inlineStyle: JSX.CSSProperties = { ...props.style }

    return (
      <div className={classes.toString()} style={inlineStyle}>
        TSX component template.
      </div>
    )
  }
}

export type { Props }
export default Template
