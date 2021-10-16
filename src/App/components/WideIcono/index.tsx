import { Component, JSX } from 'preact'
import clss from 'classnames'
import './styles.css'
import Video, { Props as VideoProps } from '../../../modules/le-monde/components/Video'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  loadVideo?: boolean
  imageUrl?: string
  hlsVideoUrl?: string
  videoUrl?: string
  videoType?: string
  opacifierOpacity?: number
}

interface State {
  isVideoLoaded: boolean
  isVideoPlaying: boolean
}

class WideIcono extends Component<Props, State> {
  _mainClass: string = 'frag-wide-icono'
  get mainClass () { return this._mainClass }
  $root: HTMLDivElement|null = null
  videoPlayingCheckInterval: number|null = null
  state: State = {
    isVideoLoaded: false,
    isVideoPlaying: false
  }

  constructor (props: Props) {
    super(props)
    this.videoMuteAttributeWorkaround = this.videoMuteAttributeWorkaround.bind(this)
    this.checkIfVideoHasStartedPlaying = this.checkIfVideoHasStartedPlaying.bind(this)
    this.videoPlayingCheckInterval = window.setInterval(this.checkIfVideoHasStartedPlaying, 100)
  }

  static getDerivedStateFromProps (props: Props, state: State) {
    if (props.loadVideo === true) return { ...state, isVideoLoaded: true }
    else return state
  }

  componentDidMount () {
    this.videoMuteAttributeWorkaround()
    this.checkIfVideoHasStartedPlaying()
  }

  componentDidUpdate () {
    this.videoMuteAttributeWorkaround()
    this.checkIfVideoHasStartedPlaying()
  }

  componentWillUnmount () {
    if (this.videoPlayingCheckInterval === null) return
    window.clearInterval(this.videoPlayingCheckInterval)
  }

  videoMuteAttributeWorkaround () {
    const $video = this.$root?.querySelector('video')
    if ($video === null || $video === undefined) return
    const currentMuted = $video.getAttribute('muted')
    if (currentMuted !== null) return
    $video.setAttribute('muted', '')
    $video.load()
  }

  checkIfVideoHasStartedPlaying () {
    const $video = this.$root?.querySelector('video')
    if (this.videoPlayingCheckInterval === null) return
    if ($video === null || $video === undefined) return
    if (!($video.currentTime > 0 && !$video.paused && !$video.ended && $video.readyState > 2)) return
    if (this.state.isVideoPlaying) return window.clearInterval(this.videoPlayingCheckInterval)
    this.setState({ isVideoPlaying: true })
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props, state } = this
    const videoIsPlayingClass = state.isVideoPlaying ? `${this.mainClass}_video-playing` : ''
    const classes = clss(this._mainClass, videoIsPlayingClass, props.className)
    const inlineStyle: JSX.CSSProperties = { ...props.style }
    const imageStyle: JSX.CSSProperties = { backgroundImage: `url(${props.imageUrl})` }
    const opacifierStyle: JSX.CSSProperties = { backgroundColor: `rgb(0, 0, 0, ${(props.opacifierOpacity ?? 0) / 100})` }
    const videoProps: VideoProps = {
      muted: true,
      autoPlay: true,
      loop: true,
      autoLoad: true,
      playsInline: true,
      poster: props.imageUrl,
      className: `${this.mainClass}__video`
    }
    return (
      <div
        className={classes}
        style={inlineStyle}
        ref={n => this.$root = n}>
        <div className={`${this.mainClass}__image`} style={imageStyle} />
        {props.videoUrl !== undefined
          && state.isVideoLoaded
          && <Video {...videoProps}>
          <source src={props.videoUrl} type={props.videoType} />
        </Video>}
        <div className={`${this.mainClass}__opacifier`} style={opacifierStyle} />
      </div>
    )
  }
}

export type { Props }
export default WideIcono
