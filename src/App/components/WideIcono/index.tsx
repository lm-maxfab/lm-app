import { Component, JSX } from 'preact'
import clss from 'classnames'
import './styles.css'
import Video, { Props as VideoProps } from '../../../modules/le-monde/components/Video'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  loadVideo?: boolean
  imageUrl?: string
  videoUrl?: string
  videoType?: string
}

interface State {
  isVideoLoaded: boolean
  fadeVideoIn: boolean
}

class WideIcono extends Component<Props, State> {
  _mainClass: string = 'frag-wide-icono'
  get mainClass () { return this._mainClass }
  state: State = {
    isVideoLoaded: false,
    fadeVideoIn: false
  }

  constructor (props: Props) {
    super(props)
    if (props.loadVideo !== true) this.state.fadeVideoIn = true
  }

  static getDerivedStateFromProps (props: Props, state: State) {
    if (props.loadVideo === true) return { ...state, isVideoLoaded: true }
    else return state
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props, state } = this
    const fadeVideoClass = state.fadeVideoIn ? `${this.mainClass}_fade-video` : ''
    const classes = clss(this._mainClass, fadeVideoClass, props.className)
    const inlineStyle: JSX.CSSProperties = { ...props.style }
    const imageStyle: JSX.CSSProperties = { backgroundImage: `url(${props.imageUrl})` }
    const videoProps: VideoProps = {
      muted: true,
      autoPlay: true,
      loop: true,
      autoLoad: true,
      poster: props.imageUrl,
      className: `${this.mainClass}__video`
    }
    return (
      <div className={classes} style={inlineStyle}>
        <div className={`${this.mainClass}__image`} style={imageStyle} />
        {props.videoUrl !== undefined
          && state.isVideoLoaded
          && <Video {...videoProps}>
          <source src={props.videoUrl} type={props.videoType} />
        </Video>}
      </div>
    )
  }
}

export type { Props }
export default WideIcono
