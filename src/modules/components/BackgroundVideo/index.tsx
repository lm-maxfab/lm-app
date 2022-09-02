import { Component } from 'preact'
import bem from '../../utils/bem'
import './styles.scss'

interface Props {
  height?: string|number
  sourceUrl?: string
  fallbackUrl?: string
}

interface State {
  isPlaying: boolean
}

export default class BackgroundVideo extends Component<Props, State> {
  /* * * * * * * * * * * * * * *
   * PROPERTIES
   * * * * * * * * * * * * * * */
  static clss = 'lm-background-video'
  clss = BackgroundVideo.clss
  $video: HTMLVideoElement|null = null
  intervalPlayingStateChecker: number|null = null
  state: State = {
    isPlaying: false
  }

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
    this.checkIfPlaying = this.checkIfPlaying.bind(this)
    this.setPlayingState = this.setPlayingState.bind(this)
  }

  /* * * * * * * * * * * * * * *
   * LIFECYCLE
   * * * * * * * * * * * * * * */
  componentDidMount (): void {
    this.intervalPlayingStateChecker = window.setInterval(() => {
      this.setPlayingState()
    }, 500)
  }

  componentWillUnmount(): void {
    if (this.intervalPlayingStateChecker !== null) {
      window.clearInterval(this.intervalPlayingStateChecker)
    }
  }

  /* * * * * * * * * * * * * * *
   * METHODS
   * * * * * * * * * * * * * * */
  checkIfPlaying () {
    const { $video } = this
    if ($video === null) return false
    const { paused, ended } = $video
    return !paused && !ended
  }

  setPlayingState () {
    this.setState({ isPlaying: this.checkIfPlaying() })
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render () {
    const { sourceUrl, fallbackUrl, height } = this.props
    const { isPlaying } = this.state
    const wrapperClasses = bem(this.clss).mod({
      'is-playing': isPlaying,
      'has-height': height !== undefined
    })
    return <div
      style={{ height }}
      className={wrapperClasses.value}>
      {fallbackUrl && <img
        className={bem(this.clss).elt('fallback').value}
        src={fallbackUrl} />}
      <video
        className={bem(this.clss).elt('video').value}
        autoPlay
        muted
        loop
        poster={fallbackUrl}
        ref={n => { this.$video = n }}>
        <source src={sourceUrl} />
      </video>
    </div>
  }
}