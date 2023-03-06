import { Component } from 'preact'
import { BlockContext } from '..'
import HtmlBlockRenderer from './HtmlBlockRenderer'
import ModuleBlockRenderer from './ModuleBlockRenderer'

type Props = {
  type?: 'module' | 'html'
  content?: string
  context?: BlockContext
  cssLoader?: (url: string) => Promise<void>
}

const allowedTypes: Props['type'][] = ['html', 'module', undefined]

export default class BlockRenderer extends Component<Props> {
  render() {
    const { props } = this
    const { type, content, context, cssLoader } = props
    if (!allowedTypes.includes(type)) console.warn(`BlockRenderer: Unknown block type: ${type}`)
    switch (type) {
      case 'html':

      case undefined: return <HtmlBlockRenderer content={content} />

      case 'module':
        return <ModuleBlockRenderer
          url={content}
          context={context}
          cssLoader={cssLoader} />

      default: return <></>
    }
  }
}
