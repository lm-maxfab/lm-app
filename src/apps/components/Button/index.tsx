import { Component, VNode } from 'preact'
import SmallArrow from '../SmallArrow'
import './styles.scss'

type Props = {
  text?: VNode | string,
  url?: string,
}

type State = {
}

export default class Episode extends Component<Props, State> {
  render() {
    const { url, text } = this.props

    return <div class='crim-footer__cta'>
      <a href={url}>
        <span>{text}<SmallArrow /></span>
      </a>
    </div>
  }
}
