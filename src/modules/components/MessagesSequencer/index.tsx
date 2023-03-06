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
  play: boolean
  finished: boolean
}

class MessagesSequencer extends Component<Props, State> {
  state: State = {
    play: false,
    finished: false,
  }

  componentDidUpdate(previousProps: Readonly<Props>, previousState: Readonly<State>, snapshot: any): void {
    if (!previousProps.active && this.props.active) {
      this.setState({ play: true })
    }
  }

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

    if (state.finished) wrapperClasses.push(`${messagesClass}_wrapper--finished`)

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
                <p class={textClasses.join(' ')}>{message.text}</p>
              </div>
            )
          })}
        </div>
      )
    }

    const handleLastStep = () => {
      this.setState({
        play: false,
        finished: true
      })
    }

    return <div className={wrapperClasses.join(' ')}>
      <Sequencer
        play={state.play}
        tempo={props.tempo}
        onLastStep={handleLastStep}
        renderer={messagesRenderer}
      />
    </div>
  }
}

export type { Props, MessagesSequencer, MessageData }
export default MessagesSequencer
