import { Component } from 'preact'
import { BlockContext } from '../..'
import StopMotionV2 from '../../../../components/StopMotionV2'

type Props = {
  context?: BlockContext
  imagesList?: string
}

export default class MotionBlockRenderer extends Component<Props> {
  render () {
    const { context, imagesList } = this.props

    const imagesArray = imagesList?.split(',') as string[]

    return <StopMotionV2 progression={context?.progression} images={imagesArray}></StopMotionV2>
  }
}
