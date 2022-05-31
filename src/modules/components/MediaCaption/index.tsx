import { Component, VNode } from 'preact'
import MediaDescription from '../MediaDescription'
import MediaCredits from '../MediaCredits'

export interface Props {
  description?: VNode|string
  credits?: VNode|string
}

export default class MediaCaption extends Component<Props, {}> {
  render () {
    const { description, credits } = this.props

    return <figcaption className='lm-media-caption'>
      {description !== undefined && <><MediaDescription content={description} /> </> }
      {credits !== undefined && <MediaCredits content={credits} />}
    </figcaption>
  }
}
