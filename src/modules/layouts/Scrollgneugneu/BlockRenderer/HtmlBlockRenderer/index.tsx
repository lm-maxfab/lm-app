import { Component } from 'preact'
import styles from './styles.module.scss'
import StrToVNode from '../../../../components/StrToVNodes'

type Props = {
  content?: string
}

export default class HtmlBlockRenderer extends Component<Props> {
  render () {
    const { content } = this.props
    return content !== undefined
      ? <div className={`lm-html-block-renderer ${styles['wrapper']}`}>
        <StrToVNode content={content} />
      </div>
      : null
  }
}
