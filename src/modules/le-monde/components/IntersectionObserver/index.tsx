import { Component, JSX } from 'preact'
import clss from 'classnames'
import './styles.css'

type IO = IntersectionObserver
type IOE = IntersectionObserverEntry

interface ObserverOptions {
  root?: HTMLElement
  rootMargin?: string
  threshold?: number[]|number
}

interface Props extends ObserverOptions {
  className?: string
  style?: JSX.CSSProperties
  callback?: (ioEntry: IOE, observer: IO) => void
  render?: (ioEntry: IOE|null) => JSX.Element
}

interface State {
  io_entry: IOE|null
}

class IntersectionObserverComponent extends Component<Props, State> {
  /* * * * * * * * * * * * * * *
   * PROPERTIES
   * * * * * * * * * * * * * * */
  mainClass: string = 'lm-intersection-observer'
  $root: HTMLDivElement|null = null
  $pRoot: HTMLDivElement|null = null
  observer: IO = new IntersectionObserver(this.observation)
  state: State = {
    io_entry: null
  }

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
    this.$pRoot = this.$root
    this.updateObserver()
  }

  componentDidUpdate (prevProps: Props) {
    const shouldUpdateObserver = prevProps.root !== this.props.root
      || prevProps.rootMargin !== this.props.rootMargin
      || prevProps.threshold?.toString() !== this.props.threshold?.toString()
      || this.$pRoot !== this.$root
    if (shouldUpdateObserver) this.updateObserver()
    if (this.$pRoot !== this.$root) this.$pRoot = this.$root
  }

  /* * * * * * * * * * * * * * *
   * METHODS
   * * * * * * * * * * * * * * */
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
    if (this.props.callback !== undefined) this.props.callback(entries[0], observer)
    this.setState({ io_entry: entries[0] })
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props, state } = this

    // Logic
    const rendered = props.render !== undefined ? props.render(state.io_entry) : null

    // Classes
    const classes: string = clss(this.mainClass, props.className)
    const inlineStyle = { ...props.style }

    // Display
    return <div
      ref={$n => { this.$root = $n }}
      className={classes}
      style={inlineStyle}>
      {rendered}
    </div>
  }
}

export type { Props, State }
export default IntersectionObserverComponent
