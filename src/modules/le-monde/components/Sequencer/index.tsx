import { Component, JSX } from 'preact'

type PropsStep = number|'beginning'|'end'|'next'|'prev'
type StateStep = number

interface Props {
  tempo?: number
  length?: number
  loop?: boolean
  render?: (step: number) => JSX.Element[]|JSX.Element
}

interface State {
  step: StateStep
  status: 'play'|'pause'
}

class Sequencer extends Component<Props, State> {
  _mainClass: string = 'lm-sequencer'
  get mainClass (): string { return this._mainClass }

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
    this.convertPropsStepIntoStateStep = this.convertPropsStepIntoStateStep.bind(this)
  }

  /* * * * * * * * * * * * * * *
   * LIFECYCLE
   * * * * * * * * * * * * * * */
  componentWillUnmount (): void {
    if (this._nextStepTimeout === null) return
    window.clearTimeout(this._nextStepTimeout)
  }

  /* * * * * * * * * * * * * * *
   * METHODS
   * * * * * * * * * * * * * * */
  _getLength (): number {
    return this.props.length ?? this._defaultLength
  }

  convertPropsStepIntoStateStep (step: PropsStep, currStep: StateStep): number {
    const length = this.props.length ?? this._getLength()
    let outStateStep: number
    if (step === 'beginning') outStateStep = 0
    else if (step === 'end') outStateStep = Math.max(length - 1, 0)
    else if (step === 'prev') outStateStep = currStep - 1
    else if (step === 'next') outStateStep = currStep + 1
    else outStateStep = step
    const moduloStep = outStateStep % length
    const newStep = Number.isNaN(moduloStep) ? 0 : moduloStep
    return newStep
  }

  goTo (step: PropsStep = 'next'): void {
    this.setState((curr: State) => {
      const newStep = this.convertPropsStepIntoStateStep(step, curr.step)
      if (newStep === curr.step) return null
      return { ...curr, step: newStep }
    })
  }

  play (): void {
    this.setState({ status: 'play' })
    this.planNextStep()
  }

  pause (): void {
    this.cancelNextStep()
    this.setState({ status: 'pause' })
  }

  planNextStep (): void {
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

  cancelNextStep (): void {
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
