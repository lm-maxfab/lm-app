import { Component, JSX } from 'preact'
<<<<<<< HEAD
import bem, { BEM } from '../../utils/bem'
import './styles.css'
=======
import bem from '../../utils/bem'
>>>>>>> master

interface Props extends JSX.HTMLAttributes<HTMLImageElement> {
  className?: string
  style?: JSX.CSSProperties
}

class Img extends Component<Props, {}> {
<<<<<<< HEAD
  bem: BEM = bem('lm-img')
=======
  clss = 'lm-img'

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
    this.noAltWarn = this.noAltWarn.bind(this)
  }

  /* * * * * * * * * * * * * * *
   * LIFECYCLE
   * * * * * * * * * * * * * * */
  componentDidMount (): void {
    if (this.props.alt === undefined) this.noAltWarn()
  }

  componentDidUpdate (prevProps: Props): void {
    if (
      this.props.alt === undefined
      && prevProps.alt !== undefined) this.noAltWarn()
  }

  /* * * * * * * * * * * * * * *
   * METHODS
   * * * * * * * * * * * * * * */
  noAltWarn (): void {
    console.warn(
      'img elements must have an alt prop,',
      'either with meaningful text,',
      'or an empty string for decorative images',
      'jsx-a11y/alt-text')
  }
>>>>>>> master

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this
<<<<<<< HEAD
    const classes = this.bem.block(props.className)
    const inlineStyle: JSX.CSSProperties = { ...props.style }
    const pprops = {
      loading: 'lazy',
      ...props,
      style: inlineStyle,
      className: classes.value
    }
    console.log(pprops)
=======
    const classes = bem(props.className ?? '').block(this.clss)
    const inlineStyle: JSX.CSSProperties = { ...props.style }
>>>>>>> master

    return (
      <img
        loading='lazy'
<<<<<<< HEAD
=======
        alt=''
>>>>>>> master
        {...props}
        style={inlineStyle}
        className={classes.value} />
    )
  }
}

export type { Props }
export default Img
