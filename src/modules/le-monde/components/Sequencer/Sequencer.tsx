import { Component, JSX } from 'preact'
import SequencerSlot from './SequencerSlot'
import './styles.css'

interface Props {
  tempo?: number
  length?: number
  loop?: boolean
  children?: JSX.Element[]
}

interface State {
  step: number
  status: 'play'|'pause'
}

class Sequencer extends Component<Props, State> {
  state: State = {
    step: 0,
    status: 'pause'
  }

  defaultTempo: number = 60
  defaultLength: number = 10
  nextStepTimeout: number|null = 0

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
    this.goTo = this.goTo.bind(this)
    this.play = this.play.bind(this)
    this.pause = this.pause.bind(this)
    this.planNextStep = this.planNextStep.bind(this)
  }

  /* * * * * * * * * * * * * * *
   * METHODS
   * * * * * * * * * * * * * * */
  goTo (step: number|'beginning'|'end'|'next'|'prev' = 'next') {
    const length = this.props.length ?? this.defaultLength
    this.setState((curr: State) => {
      let rawNewStep: number
      if (step === 'beginning') rawNewStep = 0
      else if (step === 'end') rawNewStep = (this.props.length ?? this.defaultLength) - 1
      else if (step === 'prev') rawNewStep = curr.step - 1
      else if (step === 'next') rawNewStep = curr.step + 1
      else rawNewStep = step
      return { ...curr, step: rawNewStep % length }
    })
  }

  play () {
    this.setState({ status: 'play' })
    this.planNextStep()
  }

  pause () {
    this.setState({ status: 'pause' })
  }

  planNextStep () {
    const tempo = this.props.tempo ?? this.defaultTempo
    const delay = 60000 / tempo
    const length = this.props.length ?? this.defaultLength
    this.nextStepTimeout = window.setTimeout(() => {
      if (this.state.status === 'pause') return
      const isLastStep = this.state.step === length - 1
      if (isLastStep && this.props.loop !== true) return
      this.goTo('next')
      this.planNextStep()
    }, delay)
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props, state } = this

    console.log('Render the sequencer, step:', state.step)

    const rendered = (props.children ?? []).map(child => {
      console.log(child.type === SequencerSlot)
      return <div>CHILD</div>
    })
    
    // props.children?.map(child => {
    //   console.log(child.props)
    // })

    return <>
      {rendered}
    </>
    // console.log(props.children?.map(child => {
    //   console.log(child)
    // }))

    return <>
      I am a sequencer.
    </>
  }
}

export type { Props }
export default Sequencer
