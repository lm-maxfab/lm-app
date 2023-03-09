import { Component, JSX } from 'preact'
import styles from './styles.module.scss'

import StrToHtml from '../StrToHtml'
import Sequencer from '../Sequencer'
import { RendererArgs } from '../Sequencer'

interface MessageData {
  text: string
  startStep?: number
  type?: string
}

interface Props {
  tempo: number
  scrollInfo: string
  content: MessageData[]
  active: boolean
  customClass: string | null
}

interface State {
}

class MessagesSequencer extends Component<Props, State> {

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render(): JSX.Element {
    const { props, state } = this

    const messagesClass = 'lm-cover__messages'
    const messageClass = 'lm-cover__message'

    const wrapperClasses = [
      `${messagesClass}_wrapper`,
      styles['wrapper']
    ]

    if (props.customClass != null) wrapperClasses.push(props.customClass)
    if (props.active === false) wrapperClasses.push(`${messagesClass}_wrapper--inactive`)

    const messagesClasses = [
      messagesClass,
      styles['messages']
    ]

    const messagesRenderer = ({ step }: RendererArgs) => {
      return (
        <div class={messagesClasses.join(' ')}>
          {props.content.map((message, index) => {
            const start = message.startStep ?? index

            const containerClasses = [
              `${messageClass}_container`,
              styles['message-container']
            ]

            const textClasses = [
              messageClass,
              styles['message']
            ]

            containerClasses.push(`${messageClass}_container--${index}`)

            if (start < step) {
              containerClasses.push(styles['message-container--visible'])
              containerClasses.push(`${messageClass}_container--visible`)
            }

            if (message.type != '' && message.type != undefined) {
              containerClasses.push(`${messageClass}_container--${message.type}`)
            }

            return (
              <div class={containerClasses.join(' ')}>
                <p class={textClasses.join(' ')}>
                  <StrToHtml content={message.text}></StrToHtml>
                </p>
              </div>
            )
          })}
        </div>
      )
    }

    return <div className={wrapperClasses.join(' ')}>
      <Sequencer
        play={props.active}
        tempo={props.tempo}
        renderer={messagesRenderer}
      />
    </div>
  }
}

export type { Props, MessagesSequencer, MessageData }
export default MessagesSequencer
