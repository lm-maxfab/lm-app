import { Component, JSX } from 'preact'
import styles from './styles.module.scss'

import ScrollInfo from '../ScrollInfo'
import Sequencer from '../Sequencer'
import { RendererArgs } from '../Sequencer'

interface ContentData {
  text: string
  name?: string
}

interface Props {
  tempo: number
  scrollInfo: string
  content: ContentData
  active: boolean
}

interface State {
  play: boolean
  finished: boolean
}

class TextSequencer extends Component<Props, State> {
  state: State = {
    play: false,
    finished: false,
  }

  componentDidUpdate(previousProps: Readonly<Props>, previousState: Readonly<State>, snapshot: any): void {
    if (!previousProps.active && this.props.active && !this.state.finished) {
      this.setState({ play: true })
    }
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render(): JSX.Element {
    const { props, state } = this

    console.log(props)

    const rootClass = 'lm-cover__sequencer'

    const quoteArray = props.content.text.split(' ')
    const nameArray = props.content.name?.split(' ')

    const wrapperClasses = [
      `${rootClass}_wrapper`,
      styles['wrapper']
    ]

    if (state.finished) wrapperClasses.push(`${rootClass}_wrapper--finished`)

    const textClasses = [
      `${rootClass}`,
      styles['text']
    ]

    const quoteClasses = [
      `${rootClass}_quote`,
      styles['quote']
    ]

    const nameClasses = [
      `${rootClass}_name`,
      styles['name']
    ]

    const quoteLength = quoteArray.length + 1
    const nameLength = nameArray ? nameArray.length + 1 : 0

    const sequencerLength = quoteLength + nameLength

    const mapWords = (props: { array: string[], start?: number, step: number }) => {
      const { array, start, step } = props

      if (array === undefined) return <></>
      if (array.length === 0) return <></>

      return array.map((word, index) => {
        const wordClasses = [
          `${rootClass}_word`,
          styles['word']
        ]

        if ((index + (start ?? 0)) < step) {
          wordClasses.push(`${rootClass}_word--visible`)
          wordClasses.push(styles['word--visible'])
        }

        return <span class={wordClasses.join(' ')}>{word} </span>
      })
    }

    const textRenderer = ({ step }: RendererArgs) => {
      return (
        <>
          <p class={quoteClasses.join(' ')}>
            {mapWords({ array: quoteArray, step })}
          </p>

          {nameArray && <p class={nameClasses.join(' ')}>
            {mapWords({ array: nameArray, start: quoteLength, step })}
          </p>}

        </ >
      )
    }

    const handleLastStep = () => {
      this.setState({
        play: false,
        finished: true
      })
    }

    return <div className={wrapperClasses.join(' ')}>
      <div className={textClasses.join(' ')}>
        <Sequencer
          play={state.play}
          tempo={props.tempo}
          length={sequencerLength}
          renderer={textRenderer}
          onLastStep={handleLastStep}
        />
      </div>
      {state.finished && <ScrollInfo text={props.scrollInfo} />}
    </div >
  }
}

export type { Props, ContentData, TextSequencer }
export default TextSequencer
