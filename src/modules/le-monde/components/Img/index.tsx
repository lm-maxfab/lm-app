import { Component, JSX } from 'preact'
import bem, { BEM } from '../../utils/bem'

interface Props extends JSX.HTMLAttributes<HTMLImageElement> {
  className?: string
  style?: JSX.CSSProperties
}

class Img extends Component<Props, {}> {
  bem: BEM = bem('lm-img')

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this
    const classes = this.bem.block(props.className)
    const inlineStyle: JSX.CSSProperties = { ...props.style }

    return (
      <img
        loading='lazy'
        {...props}
        style={inlineStyle}
        className={classes.value} />
    )
  }
}

export type { Props }
export default Img
