import { Component } from 'preact'
import { BlockContext } from '..'
import HtmlBlockRenderer from './HtmlBlockRenderer'
import ModuleBlockRenderer from './ModuleBlockRenderer'
import MotionBlockRenderer from './MotionBlockRenderer'

type Props = {
  type?: 'module'|'html'|'motion'
  content?: string
  context?: BlockContext
  prevContext?: BlockContext // [WIP] remove this
  cssLoader?: (url: string) => Promise<void>
}

export default class BlockRenderer extends Component<Props> {
  render () {
    const { props } = this
    const { type, content, context, cssLoader } = props
    switch (type) {
      case 'html':
      case undefined: return <HtmlBlockRenderer content={content} />
      case 'module': return <ModuleBlockRenderer
        url={content}
        context={context}
        cssLoader={cssLoader} />
      case 'motion': return <MotionBlockRenderer
        imagesList={content}
        context={context} />
      default: return <div>Block type {type} is unknown</div>
    }
  }
}
