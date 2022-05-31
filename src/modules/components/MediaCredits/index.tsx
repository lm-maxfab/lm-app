import { Component, VNode } from 'preact'
import './styles.scss'

export interface Props {
  content?: VNode|string
}

export default class MediaCredits extends Component<Props, {}> {
  render () {
    return <span className='lm-media-credits'>
      {this.props.content}
    </span>
  }
}
