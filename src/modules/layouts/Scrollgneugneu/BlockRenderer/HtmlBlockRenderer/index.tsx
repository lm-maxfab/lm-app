import { Component } from 'preact'
import StrToVNode from '../../../../components/StrToVNodes'

type Props = {
  content?: string
}

export default class HtmlBlockRenderer extends Component<Props> {
  render () {
    const { content } = this.props
    return content !== undefined
      ? <StrToVNode content={content} />
      : null
  }
}
