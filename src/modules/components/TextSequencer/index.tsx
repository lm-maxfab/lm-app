import { Component, JSX } from 'preact'
import styles from './styles.module.scss'

import Sequencer from '../Sequencer'
import { RendererArgs } from '../Sequencer'

interface Props {
  tempo: number
  content: string
  play: boolean
}

interface State { }

class TextSequencer extends Component<Props, State> {

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render(): JSX.Element {
    const { props } = this

    const textArray = props.content.split(' ')

    const wrapperClasses = [
      styles['wrapper']
    ]

    const textRenderer = ({ step }: RendererArgs) => {
      return (
        <p>
          {textArray.map((word, index) => {
            const classes = [styles['word']]
            if (index < step) classes.push(styles['word--visible'])
            return <span class={classes.join(' ')}>{word} </span>
          })}
        </p>
      )
    }

    return <div className={wrapperClasses.join(' ')}>
      <Sequencer
        play={props.play}
        tempo={props.tempo}
        renderer={textRenderer}
      />
    </div>
  }
}

export type { Props, TextSequencer }
export default TextSequencer
