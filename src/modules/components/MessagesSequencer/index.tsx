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
  content: MessageData[]
  play: boolean
}

interface State { }

class MessagesSequencer extends Component<Props, State> {

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render(): JSX.Element {
    const { props } = this

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
              `${messagesClass}_container`,
              styles['message-container']
            ]

            const textClasses = [
              messageClass,
              styles['message']
            ]

            if (start < step) containerClasses.push(styles['message-container--visible'])

            if (message.type != '' && message.type != undefined) {
              containerClasses.push(`${messagesClass}_container--${message.type}`)
            }

            return (
              <div class={containerClasses.join(' ')}>
                <p class={textClasses.join(' ')}>{message.text}</p>
              </div>
            )
          })}
        </div>
      )
    }

    return <div className={wrapperClasses.join(' ')}>
      <Sequencer
        play={props.play}
        tempo={props.tempo}
        renderer={messagesRenderer}
      />
    </div>
  }
}

export type { Props, MessagesSequencer, MessageData }
export default MessagesSequencer
