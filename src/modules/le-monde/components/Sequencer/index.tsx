import { Component, JSX } from 'preact'

interface RendererArgs {
  step: number
  value: any
}

interface Props {
  tempo?: number
  play?: boolean
  length?: number
  sequence?: any[]
  renderer?: (args: RendererArgs) => any
}

interface State {
  step: number
}

class Sequencer extends Component<Props, State> {
  intervaller: number|null = null
  state: State = {
    step: 0
  }

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR & LIFE CYCLE
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
    this.startPlaying = this.startPlaying.bind(this)
    this.stopPlaying = this.stopPlaying.bind(this)
    this.updateTempo = this.updateTempo.bind(this)
    this.goToStep = this.goToStep.bind(this)
  }

  componentDidMount () {
    if (this.props.play) this.startPlaying()
  }

  componentDidUpdate (prevProps: Props) {
    if (prevProps.play !== this.props.play) {
      if (this.props.play === true) this.startPlaying()
      else this.stopPlaying()
    }
    if (prevProps.tempo !== this.props.tempo) {
      this.updateTempo()
    }
  }

  /* * * * * * * * * * * * * * *
   * METHODS
   * * * * * * * * * * * * * * */
  startPlaying () {
    const tempo = (this.props.tempo === undefined || this.props.tempo <= 0) ? 60 : this.props.tempo
    const cappedTempo = Math.min(tempo, 60 * 1000)
    if (cappedTempo !== tempo) console.warn('Maximum tempo is 60 000 bpm')
    const timeIntervalMs = (60 * 1000) / cappedTempo
    this.intervaller = window.setInterval(() => this.goToStep('next'), timeIntervalMs)
  }

  stopPlaying () {
    if (this.intervaller === null) return
    window.clearInterval(this.intervaller)
    this.intervaller = null
  }

  goToStep (step: number|'next'|'prev') {
    this.setState(curr => {
      const newStep = typeof step === 'number'
        ? step
        : step === 'next'
          ? curr.step + 1
          : curr.step - 1
      if (curr.step === newStep) return null
      if (this.props.length !== undefined) return { ...curr, step: newStep % this.props.length }
      else if (this.props.sequence !== undefined) return { ...curr, step: newStep % this.props.sequence.length }
      else return { ...curr, step: newStep }
    })
  }

  updateTempo () {
    if (this.intervaller === null) return
    else {
      this.stopPlaying()
      this.startPlaying()
    }
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props, state } = this
    if (props.renderer === undefined) return null
    
    const value = props.sequence !== undefined
      ? props.sequence[state.step]
      : state.step
    
    return props.renderer({ step: state.step, value })
  }
}

export type { Props }
export default Sequencer
