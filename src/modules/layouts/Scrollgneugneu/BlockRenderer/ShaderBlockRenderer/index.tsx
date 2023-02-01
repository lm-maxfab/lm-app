import { Component } from 'preact'
import { BlockContext } from '../..'
import CanvasGL from '../../../../components/CanvasGL'

type State = {
  shader?: string | null
}

type Props = {
  context?: BlockContext
  shaderUrl?: string
}

export default class ShaderBlockRenderer extends Component<Props> {
  constructor(props: Props) {
    super(props)
    this.loadShader = this.loadShader.bind(this)
  }

  state: State = {
    shader: null,
  }

  componentDidMount(): void {
    if (!this.props.shaderUrl) return
    this.loadShader(this.props.shaderUrl)
  }

  async loadShader(url: string) {
    fetch(url)
      .then(response => response.text())
      .then((loadedData) =>
        this.setState({
          shader: loadedData,
        }))
  }

  render() {
    const { context } = this.props
    const { shader } = this.state

    if (!context) return
    if (!shader) return

    return <CanvasGL 
      progression={context.progression ?? 0} 
      shader={shader}
      width={context.width}
      height={context.height}
      ></CanvasGL>
  }
}
