import { Component } from 'preact'
import { BlockContext } from '..'
import HtmlBlockRenderer from './HtmlBlockRenderer'
import ModuleBlockRenderer from './ModuleBlockRenderer'

import TextSequencer from '../../../components/TextSequencer'
import { ContentData } from '../../../components/TextSequencer'

import MessagesSequencer from '../../../components/MessagesSequencer'
import { MessageData } from '../../../components/MessagesSequencer'

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
        // [WIP] remove this
        const sequencerDetectionRegexp = /^\[\[SEQUENCER\]\]/

        if (content?.match(sequencerDetectionRegexp)) {
          const sequencerPropsStr = content
            .replace(sequencerDetectionRegexp, '')
            .trim()
          const sequencerProps = {
            tempo: 60,
            content: "Lorem ipsum dolor sit amet."
          }
          let sequencerType = "text"

          try {
            console.log(sequencerPropsStr)
            const parsed = JSON.parse(sequencerPropsStr)
            console.log(parsed)
            if (parsed === null) break;
            if (typeof parsed !== 'object') break;
            if (Array.isArray(parsed)) break;
            if (typeof parsed.tempo === 'number') sequencerProps.tempo = parsed.tempo
            if (parsed.content != '') sequencerProps.content = parsed.content
            if (parsed.type === 'messages') sequencerType = 'messages'
          } catch (err) { console.log(err) }

          if (sequencerType === "text") {
            return <TextSequencer
              content={sequencerProps.content as unknown as ContentData}
              tempo={sequencerProps.tempo}
              active={context?.page === 0}
            />
          }

          if (sequencerType === "messages") {
            return <MessagesSequencer
              content={sequencerProps.content as unknown as MessageData[]}
              tempo={sequencerProps.tempo}
              play={context?.page === 0}
            />
          }
        }

        return <ModuleBlockRenderer
          url={content}
          context={context}
          cssLoader={cssLoader} />

      default: return <></>
    }
  }
}
