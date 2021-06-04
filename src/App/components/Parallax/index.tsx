import React from 'react'
import clss from 'classnames'
import styles from './styles.module.css'

interface Props {
  className?: string
  style?: React.CSSProperties
}

interface State {
  isIntersecting: boolean,
  scrollPercent: number
}

type IO = IntersectionObserver
type IOE = IntersectionObserverEntry

class Parallax extends React.Component<Props, State> {
  state = {
    isIntersecting: false,
    scrollPercent: 0
  }
  $root:HTMLDivElement|null = null
  observer:IO = new IntersectionObserver((entries: IOE[]) => this.observation(entries, this))
  intervaler: number|null = null
  
  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
    this.observation = this.observation.bind(this)
    this.scrollListening = this.scrollListening.bind(this)
  }

  /* * * * * * * * * * * * * * *
   * LIFECYCLE
   * * * * * * * * * * * * * * */
  componentDidMount () {
    if (this.$root === null) return
    this.observer.observe(this.$root)
    this.scrollListening()
  }

  componentDidUpdate () {
    const { isIntersecting } = this.state
    const { addEventListener, removeEventListener } = window
    if (isIntersecting === true) addEventListener('scroll', this.scrollListening)
    else removeEventListener('scroll', this.scrollListening)
  }

  componentWillUnmount () {
    if (this.$root === null) return
    this.observer.unobserve(this.$root)
  }

  /* * * * * * * * * * * * * * *
   * OBSERVATION
   * * * * * * * * * * * * * * */
  observation (entries: IOE[], that:Parallax) {
    const entry = entries[0]
    if (entry === undefined) return
    if (entry.isIntersecting) return that.setState({ isIntersecting: true })
    return that.setState({ isIntersecting: false })
  }

  /* * * * * * * * * * * * * * *
   * SCROLL LISTENING
   * * * * * * * * * * * * * * */
  scrollListening () {
    if (this.$root === null) return
    const rootDomRect = this.$root.getBoundingClientRect()
    const { top, bottom } = rootDomRect
    const height = bottom - top
    const viewportHeight = document.documentElement.clientHeight
    const minTop = 0
    const maxTop = -1 * (height - viewportHeight)
    const scrollPercent = (top - minTop) / (maxTop - minTop)
    this.setState({ scrollPercent })
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): React.ReactNode {
    const { props, state } = this
    const classes: string = clss('lm-parallax', styles['wrapper'], props.className)
    const inlineStyle = { ...props.style }
    const { scrollPercent } = state

    return (
      <div
        className={classes}
        style={inlineStyle}
        ref={n => this.$root = n}>
        <div style={{
          position: 'absolute',
          top: `${scrollPercent * 100}%`,
          right: 0
        }}>
          {Math.round(scrollPercent * 1000) / 10}%
        </div>
        <div>item 2</div>
        <div>item 3</div>
      </div>
    )
  }
}

export type { Props, State }
export default Parallax
