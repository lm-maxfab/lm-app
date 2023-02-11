import { Component } from 'preact'
import styles from './styles.module.scss'

type Props = {
  content?: string
}

export default class HtmlBlockRenderer extends Component<Props> {
  render () {
    const { content } = this.props
    return content !== undefined
      ? <div
        className={`lm-html-block-renderer ${styles['wrapper']}`}
        dangerouslySetInnerHTML={{ __html: content }} />
      : null
  }
}
