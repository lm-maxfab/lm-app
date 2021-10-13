import { Component, JSX } from 'preact'
import './styles.css'

interface Props {
  tempo?: number
  length?: number
  loop?: boolean
  render?: (step: number) => JSX.Element[]|JSX.Element
}

interface State {
  step: number
  status: 'play'|'pause'
}

class Sequencer extends Component<Props, State> {
  _mainClass: string = 'lm-sequencer'
  get mainClass () { return this._mainClass }

  state: State = {
    step: 0,
    status: 'pause'
  }

  _defaultTempo: number = 60
  _defaultLength: number = 10
  _nextStepTimeout: number|null = 0

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
    this.goTo = this.goTo.bind(this)
    this.play = this.play.bind(this)
    this.pause = this.pause.bind(this)
    this.planNextStep = this.planNextStep.bind(this)
    this.cancelNextStep = this.cancelNextStep.bind(this)
  }

  /* * * * * * * * * * * * * * *
   * LIFECYCLE
   * * * * * * * * * * * * * * */
  componentWillUnmount () {
    if (this._nextStepTimeout === null) return
    window.clearTimeout(this._nextStepTimeout)
  }

  /* * * * * * * * * * * * * * *
   * METHODS
   * * * * * * * * * * * * * * */
  _getLength () {
    return this.props.length ?? this._defaultLength
  }

  goTo (step: number|'beginning'|'end'|'next'|'prev' = 'next') {
    const length = this.props.length ?? this._getLength()
    this.setState((curr: State) => {
      let rawNewStep: number
      if (step === 'beginning') rawNewStep = 0
      else if (step === 'end') rawNewStep = Math.max(length - 1, 0)
      else if (step === 'prev') rawNewStep = curr.step - 1
      else if (step === 'next') rawNewStep = curr.step + 1
      else rawNewStep = step
      const moduloStep = rawNewStep % length
      const newStep = Number.isNaN(moduloStep) ? 0 : moduloStep
      return { ...curr, step: newStep }
    })
  }

  play () {
    this.setState({ status: 'play' })
    this.planNextStep()
  }

  pause () {
    this.cancelNextStep()
    this.setState({ status: 'pause' })
  }

  planNextStep () {
    const tempo = this.props.tempo ?? this._defaultTempo
    const delay = 60000 / tempo
    const length = this._getLength()
    const isLastStep = this.state.step >= length - 2
    if (isLastStep && this.props.loop !== true) return
    this._nextStepTimeout = window.setTimeout(() => {
      this.goTo('next')
      this.planNextStep()
    }, delay)
  }

  cancelNextStep () {
    if (this._nextStepTimeout === null) return
    window.clearTimeout(this._nextStepTimeout)
    this._nextStepTimeout = null
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props, state } = this
    const rendered = props.render !== undefined
      ? props.render(state.step)
      : null
    return <>{rendered}</>
  }
}

export type { Props, State }
export default Sequencer
