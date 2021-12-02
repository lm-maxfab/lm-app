import { Component, JSX } from 'preact'
import bem from '../../utils/bem'

interface Props extends JSX.HTMLAttributes<HTMLImageElement> {
  className?: string
  style?: JSX.CSSProperties
}

class Img extends Component<Props, {}> {
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

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    const classes = bem(props.className ?? '').block(this.clss)
    const inlineStyle: JSX.CSSProperties = { ...props.style }

    return (
      <img
        loading='lazy'
        alt=''
        {...props}
        style={inlineStyle}
        className={classes.value} />
    )
  }
}

export type { Props }
export default Img
