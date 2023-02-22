import { Component, JSX } from 'preact'
import bem, { BEM } from '../../utils/bem'
import strToNodes from '../../utils/str-to-nodes'
import StrToVNode from '../StrToVNodes'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  src?: string
  loader?: JSX.Element
  fallback?: JSX.Element
  desc?: string
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
  componentDidMount (): void {
    this.fetchSvg(this.props.src)
  }

 componentDidUpdate(previousProps: Readonly<Props>): void {
   if (this.props.src !== previousProps.src) this.fetchSvg(this.props.src)
 }

  /* * * * * * * * * * * * * * *
   * FETCH SVG
   * * * * * * * * * * * * * * */
  async fetchSvg (src?: string): Promise<void> {
    if (src === undefined) return this.setState({
      loading: false,
      error: null,
      contents: null,
      attributes: null
    })
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
    const desc = props.desc !== undefined ? `<desc>${props.desc}</desc>` : ''

    /* Assign classes */
    const classes = bem(attributes.class ?? '')
      .block(props.className)
      .block(this.bem.value)
    const inlineStyle = { ...props.style }

    /* Display */
    // [WIP] fix dangerouslySetInner with some StrToVNode or something ?
    return <svg
      {...attributes as any}
      className={classes.value}
      style={inlineStyle}
      dangerouslySetInnerHTML={{ __html: `${desc}${contents}` }} />
  }
}

export type { Props, State }
export default Svg
