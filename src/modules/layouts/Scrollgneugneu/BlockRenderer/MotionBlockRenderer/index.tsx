import { Component } from 'preact'
import { BlockContext } from '../..'
import StopMotion from '../../../../components/StopMotion'

type Props = {
  context?: BlockContext
  imagesList?: string
}

export default class MotionBlockRenderer extends Component<Props> {
  render () {
    const { context, imagesList } = this.props

    const imagesArray = imagesList?.split(',') as string[]

    return <StopMotion progression={context?.progression} images={imagesArray}></StopMotion>
  }
}
