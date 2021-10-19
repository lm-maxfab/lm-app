import { Component, JSX } from 'preact'
import clss from 'classnames'
import './styles.css'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  loader?: JSX.Element
  fallback?: JSX.Element
  src: string
}

interface State {
  loading: boolean
  error: any
  contents: SVGSVGElement|null
}

class Svg extends Component<Props, State> {
  mainClass: string = 'lm-svg'
  state = {
    loading: false,
    error: null,
    contents: null
  }
  $root: HTMLDivElement|null = null

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
    this.fetchSvg = this.fetchSvg.bind(this)
  }

  /* * * * * * * * * * * * * * *
   * DID MOUNT
   * * * * * * * * * * * * * * */
  async componentDidMount (): Promise<void> {
    await this.fetchSvg(this.props.src)
  }

  /* * * * * * * * * * * * * * *
   * FETCH SVG
   * * * * * * * * * * * * * * */
  async fetchSvg (src: string): Promise<void> {
    this.setState({ loading: true, error: null })
    try {
      const response = await window.fetch(src)
      const text = await response.text()
      const fakeDiv = document.createElement('DIV')
      fakeDiv.innerHTML = text
      const $svg = fakeDiv.querySelector('svg')
      this.setState({ loading: false, error: null, contents: $svg })
    } catch (err) {
      this.setState({ loading: false, error: err })
    }
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props, state } = this
    const classes: string = clss(this.mainClass, props.className)
    const inlineStyle = { ...props.style }

    /* Logic */
    const svgString = state.contents !== null
      ? (state.contents as SVGSVGElement).outerHTML
      : ''

    /* Display */
    return <div
      className={classes}
      style={inlineStyle}
      ref={n => { this.$root = n }}>
      {/* state.loading && (props.loader ?? 'Loading...') */}
      {/* state.error !== null && (props.fallback ?? `Error while loading resource at ${props.src}`) */}
      <div
        className={`${this.mainClass}__inner`}
        dangerouslySetInnerHTML={{ __html: svgString }} />
    </div>
  }
}

export type { Props, State }
export default Svg
