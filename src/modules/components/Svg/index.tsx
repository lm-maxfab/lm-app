import { Component, JSX } from 'preact'
import bem, { BEM } from '../../utils/bem'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  loader?: JSX.Element
  fallback?: JSX.Element
  src: string
  width?: string|number
  height?: string|number
}

interface State {
  loading: boolean
  error: any
  contents: string|null
  attributes: JSX.SVGAttributes<SVGElement>|null
}

class Svg extends Component<Props, State> {
  bem: BEM = bem('lm-svg')
  $root: HTMLDivElement|null = null
  state: State = {
    loading: false,
    error: null,
    contents: null,
    attributes: null
  }

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
      if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`)
      const text = await response.text()
      const fakeDiv = document.createElement('DIV')
      fakeDiv.innerHTML = text
      const $svg = fakeDiv.querySelector('svg')
      if ($svg === null) throw new Error('Not a svg')
      const contents = $svg.innerHTML
      const attributes = Array
        .from($svg.attributes)
        .reduce((acc, curr): JSX.SVGAttributes<SVGElement> => ({ ...acc, [curr.name]: curr.value }), {})
      this.setState({ loading: false, error: null, contents, attributes })
    } catch (err) {
      console.error(`Error while loading ${src}\n`, err)
      this.setState({ loading: false, error: err })
    }
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props, state } = this

    /* Logic */
    const attributes = state.attributes ?? {}
    const contents = state.contents ?? ''

    /* Assign classes */
    const classes = bem(attributes.class ?? '')
      .block(props.className)
      .block(this.bem.value)
    const inlineStyle = { ...props.style }

    /* Display */
    return <svg
      {...attributes as any}
      className={classes.value}
      style={inlineStyle}
      dangerouslySetInnerHTML={{ __html: contents }}
      width={props.width}
      height={props.height} />
  }
}

export type { Props, State }
export default Svg
