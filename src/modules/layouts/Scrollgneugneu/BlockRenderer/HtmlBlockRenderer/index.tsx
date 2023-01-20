import { Component } from 'preact'

type Props = {
  content?: string
}

export default class HtmlBlockRenderer extends Component<Props> {
  render () {
    const { content } = this.props
    return content !== undefined
      ? <div dangerouslySetInnerHTML={{ __html: content }} />
      : null
  }
}
