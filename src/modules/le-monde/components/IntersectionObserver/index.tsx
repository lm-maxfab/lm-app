import { Component, JSX } from 'preact'
import clss from 'classnames'
import './styles.css'

interface ObserverOptions {
  root?: HTMLElement
  rootMargin?: string
  threshold?: number[]|number
}

interface Props extends ObserverOptions {
  className?: string
  style?: JSX.CSSProperties
  callback?: (entries: IOE[], observer: IO) => void
}

type IO = IntersectionObserver
type IOE = IntersectionObserverEntry

class IntersectionObserverComponent extends Component<Props, {}> {
  /* * * * * * * * * * * * * * *
   * PROPERTIES
   * * * * * * * * * * * * * * */
  mainClass: string = 'lm-intersection-observer'
  $root: HTMLDivElement|null = null
  observer: IO = new IntersectionObserver(this.observation)

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
    this.getObserverOptions = this.getObserverOptions.bind(this)
    this.updateObserver = this.updateObserver.bind(this)
    this.observation = this.observation.bind(this)
  }

  /* * * * * * * * * * * * * * *
   * LIFECYCLE
   * * * * * * * * * * * * * * */
  componentDidMount () {
    this.updateObserver()
  }

  componentDidUpdate () {
    this.updateObserver()
  }

  getObserverOptions () {
    return {
      root: this.props.root,
      rootMargin: this.props.rootMargin,
      threshold: this.props.threshold
    }
  }

  updateObserver () {
    const options = this.getObserverOptions()
    this.observer.disconnect()
    this.observer = new IntersectionObserver(this.observation, options)
    if (this.$root === null) return console.warn('this.$root should not be null')
    this.observer.observe(this.$root)
  }

  observation (entries: IOE[], observer: IO): void {
    if (this.props.callback === undefined) return
    this.props.callback(entries, observer)
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this
    if (props.children === undefined) return null

    // Logic

    // Classes
    const classes: string = clss(this.mainClass, props.className)
    const inlineStyle = { ...props.style }

    // Display
    return <div
      ref={$n => { this.$root = $n }}
      className={classes}
      style={inlineStyle}>
      {props.children}
    </div>
  }
}

export type { Props }
export default IntersectionObserverComponent
