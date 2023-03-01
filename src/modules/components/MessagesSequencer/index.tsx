import { Component, JSX } from 'preact'
import styles from './styles.module.scss'

import Sequencer from '../Sequencer'
import { RendererArgs } from '../Sequencer'

interface MessageData { 
  text: string
  startStep?: number
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

    console.log(props)

    const wrapperClasses = [
      styles['wrapper']
    ]

    const messagesClasses = [
      styles['messages']
    ]

    const messagesRenderer = ({ step }: RendererArgs) => {
      return (
        <div class={messagesClasses.join(' ')}>
          {props.content.map((message, index) => {
            const start = message.startStep ?? index

            const containerClasses = [styles['message-container']]
            const classes = [styles['message']]

            if (start < step) containerClasses.push(styles['message--visible'])

            return (
              <div class={containerClasses.join(' ')}>
                <p class={classes.join(' ')}>{message.text}</p>
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
