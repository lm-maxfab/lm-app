import { Component } from 'preact'
import { BlockContext } from '../..'
import CanvasGL from '../../../../components/CanvasGL'

type Props = {
  context?: BlockContext
  shader?: string
}

export default class ShaderBlockRenderer extends Component<Props> {
  render () {
    const { context, shader } = this.props
    console.log(context)

    if (!context) return

    const width = context.width ?? 400
    const height = context.height ?? 400

    return <CanvasGL 
      progression={context.progression ?? 0} 
      shader={shader}
      width={width}
      height={height}
      ></CanvasGL>
  }
}
