import { Component, VNode } from 'preact'
import './styles.scss'

export interface Props {
  content?: VNode|string
}

export default class MediaDescription extends Component<Props, {}> {
  render () {
    return <span className='lm-media-description'>
      {this.props.content}
    </span>
  }
}
