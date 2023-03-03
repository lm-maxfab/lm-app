import { Component, JSX } from 'preact'
import styles from './styles.module.scss'

import Sequencer from '../Sequencer'
import { RendererArgs } from '../Sequencer'

interface ContentData {
  text: string
  name?: string
}

interface Props {
  tempo: number
  content: ContentData
  active: boolean
}

interface State {
  play: boolean
}

class TextSequencer extends Component<Props, State> {
  state: State = {
    play: false,
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

    console.log(props)

    const textClass = 'lm-cover__text'

    const textArray = props.content.text.split(' ')

    const wrapperClasses = [
      `${textClass}_wrapper`,
      styles['wrapper']
    ]

    const length = textArray.length + 1

    const textRenderer = ({ step }: RendererArgs) => {
      return (
        <p>
          {textArray.map((word, index) => {
            const wordClasses = [
              `${textClass}_word`,
              styles['word']
            ]

            if (index < step) {
              wordClasses.push(`${textClass}_word`)
              wordClasses.push(styles['word--visible'])
            }

            return <span class={wordClasses.join(' ')}>{word} </span>
          })}
        </p>
      )
    }

    const handleFirstStep = () => {
      console.log('first step!!')
      console.log(this)
    }

    const handleLastStep = () => {
      console.log('last step!!')
      console.log(this)

      this.setState({
        play: false
      })
    }

    const handleStepChange = () => {
      console.log('step change!!')
    }

    return <div className={wrapperClasses.join(' ')}>
      <Sequencer
        play={state.play}
        tempo={props.tempo}
        length={length}
        renderer={textRenderer}
        onFirstStep={handleFirstStep}
        onLastStep={handleLastStep}
        onStepChange={handleStepChange}
      />
    </div>
  }
}

export type { Props, ContentData, TextSequencer }
export default TextSequencer
