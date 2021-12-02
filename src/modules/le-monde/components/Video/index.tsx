import { Component, JSX } from 'preact'
import clss from 'classnames'

interface Props extends JSX.HTMLAttributes<HTMLVideoElement> {
  className?: string
  style?: JSX.CSSProperties
  autoLoad?: boolean
}

class Video extends Component<Props, {}> {
  _mainClass: string = 'lm-video'
  get mainClass (): string { return this._mainClass }
  $root: HTMLVideoElement|null = null
  prevRootInnerHTML: string|undefined

  constructor (props: Props) {
    super(props)
    this.load = this.load.bind(this)
  }

  getSnapshotBeforeUpdate (): void {
    this.prevRootInnerHTML = this.$root?.innerHTML
  }

  componentDidUpdate (): void {
    if (this.$root?.innerHTML !== this.prevRootInnerHTML
      && this.props.autoLoad === true) this.load()
  }

  load (): void {
    if (this.$root === null) return
    this.$root.load()
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this
    const classes = clss(this._mainClass, props.className)
    const inlineStyle: JSX.CSSProperties = { ...props.style }
    return (
      <video
        {...props}
        className={classes}
        style={inlineStyle}
        ref={$n => { this.$root = $n }}>
        {props.children}
      </video>
    )
  }
}

export type { Props }
export default Video
