import { Component } from 'preact'
import StrToVNode from '../../../../components/StrToVNodes'
import { Options as SanitizeOptions } from '../../../../utils/clientside-html-sanitizer'

type Props = {
  content?: string
}

// [WIP] no sanitization for 40-2302-rechauffement finalisation,
// enable this again later
const sanitizeOptions: SanitizeOptions = {
  allowedTags: ['*'],
  allowedAttributes: { '*': [{ attributeName: '*' }] }
}

export default class HtmlBlockRenderer extends Component<Props> {
  render () {
    const { content } = this.props
    return content !== undefined
      ? <StrToVNode
        content={content}
        sanitize={sanitizeOptions} />
      : null
  }
}
