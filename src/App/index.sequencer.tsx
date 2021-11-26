import { Component, JSX } from 'preact'
import { SheetBase } from '../modules/le-monde/utils/sheet-base'
import bem from '../modules/le-monde/utils/bem'
import getViewportDimensions from '../modules/le-monde/utils/get-viewport-dimensions'
import './styles.scss'
import Sequencer from '../modules/le-monde/components/Sequencer'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  sheetBase?: SheetBase
}

interface State {
  navHeight: number
  sequencer_is_playing: boolean
  sequencer_tempo: number
  sequencer_length: number
  sequencer_sequence: any[]
}

class App extends Component<Props, State> {
  clss: string = 'photos21'
  updateNavHeightInterval: number|null = null
  updateNavHeightTimeout: number|null = null
  state: State = {
    navHeight: 0,
    sequencer_is_playing: false,
    sequencer_tempo: 60,
    sequencer_length: 16,
    sequencer_sequence: ['A', 'B', 'C']
  }

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
    this.updateNavHeight = this.updateNavHeight.bind(this)
    this.handleStatusClick = this.handleStatusClick.bind(this)
    this.handleTempoChange = this.handleTempoChange.bind(this)
    this.handleLengthChange = this.handleLengthChange.bind(this)
    this.handleSequenceChange = this.handleSequenceChange.bind(this)
  }

  /* * * * * * * * * * * * * * *
   * LIFE CYCLE
   * * * * * * * * * * * * * * */
  componentDidMount () {
    window.addEventListener('resize', this.updateNavHeight)
    this.updateNavHeightTimeout = window.setTimeout(this.updateNavHeight, 20)
    this.updateNavHeightInterval = window.setInterval(this.updateNavHeight, 1000)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.updateNavHeight)
    if (this.updateNavHeightTimeout !== null) window.clearTimeout(this.updateNavHeightTimeout)
    if (this.updateNavHeightInterval !== null) window.clearInterval(this.updateNavHeightInterval)
  }

  /* * * * * * * * * * * * * * *
   * METHODS
   * * * * * * * * * * * * * * */
  updateNavHeight () {
    this.setState(curr => {
      const { navHeight } = getViewportDimensions()
      return curr.navHeight !== navHeight ? { navHeight } : null
    })
  }

  handleStatusClick () {
    this.setState(curr => ({
      ...curr,
      sequencer_is_playing: !curr.sequencer_is_playing
    }))
  }

  handleTempoChange (e: JSX.TargetedEvent<HTMLInputElement, Event>) {
    const target = e.target as HTMLInputElement
    this.setState(curr => ({ ...curr, sequencer_tempo: window.parseInt(target.value) }))
  }

  handleLengthChange (e: JSX.TargetedEvent<HTMLInputElement, Event>) {
    const target = e.target as HTMLInputElement
    this.setState(curr => ({ ...curr, sequencer_length: window.parseInt(target.value) }))
  }

  handleSequenceChange (e: JSX.TargetedEvent<HTMLInputElement, Event>) {
    const target = e.target as HTMLInputElement
    const sequence = target.value.split('/').map(e => e.trim())
    this.setState(curr => ({ ...curr, sequencer_sequence: sequence }))
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props, state } = this

    // Extract data
    const classes = bem('lm-app').block(this.clss)
    const inlineStyle: JSX.CSSProperties = {
      ...props.style,
      '--nav-height': `${state.navHeight}px`,
      padding: '64px',
      paddingTop: 'calc(var(--nav-height) + 64px)'
    }

    // Display
    return (
      <div className={classes.value} style={inlineStyle}>
        <button 
          onClick={this.handleStatusClick}>
          {state.sequencer_is_playing ? 'Pause' : 'Play'}
        </button><br />
        Tempo: <input
          type='range'
          min='0'
          max='2000'
          style={{ width: '60vw' }}
          value={state.sequencer_tempo}
          onChange={this.handleTempoChange} /> {state.sequencer_tempo}<br />
        Length: <input
          type='range'
          min='1'
          max='2000'
          style={{ width: '60vw' }}
          value={state.sequencer_length}
          onChange={this.handleLengthChange} /> {state.sequencer_length}<br />
        Sequence: <input
          type='text'
          style={{ width: '20vw' }}
          value={state.sequencer_sequence.join(' / ')}
          onChange={this.handleSequenceChange} /><br />
        <Sequencer
          tempo={state.sequencer_tempo}
          length={state.sequencer_length}
          play={state.sequencer_is_playing} 
          sequence={state.sequencer_sequence}
          renderer={({ step, value }) => {
            const rendered = [3, 5, 1, 'U']
            return <div>
              <strong>Renderer.</strong>
              <p>Step: {step}</p>
              <p>Value: {rendered[step]}</p>
            </div>
          }} />
      </div>
    )
  }
}

export type { Props }
export default App
