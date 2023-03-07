import { Component, JSX } from 'preact'
import styles from './styles.module.scss'

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

            containerClasses.push(`message-container--${index}`)

            if (start < step) containerClasses.push(styles['message-container--visible'])

            if (message.type != '' && message.type != undefined) {
              containerClasses.push(`${messageClass}_container--${message.type}`)
            }

            return (
              <div class={containerClasses.join(' ')}>
                <svg width="12" height="14" viewBox="0 0 12 14" >
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M3 0.530407C3 5.4199 5.49121 8.83875 10.4737 10.787L10.8095 10.9147C11.3275 11.1062 11.5922 11.6814 11.4007 12.1994C11.3289 12.3936 11.1986 12.5608 11.0277 12.6778C9.26716 13.883 4.42005 13.8092 0.5 14.0003V7.50027V3.54372C0.5 2.06868 1.55032 0.802711 3 0.530407V0.530407Z" />
                </svg>

                <p class={textClasses.join(' ')}>{message.text}</p>
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
