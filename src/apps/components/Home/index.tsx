import { Component, JSX, VNode } from 'preact'
import Sequencer, { RendererArgs } from '../../../modules/le-monde/components/Sequencer'
import bem from '../../../modules/le-monde/utils/bem'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  bgImageUrl?: string
  bgSize?: string
  bgPosition?: string
  bgOpacity?: number
  title?: VNode|string
  kicker?: VNode|string
  intro?: VNode|string
  playAnimation?: boolean
}

interface State {
  sequencerHasLooped: boolean
  animationStep: number
}

class Home extends Component<Props, {}> {
  static clss = 'illus21-home'
  clss = Home.clss
  state: State = {
    sequencerHasLooped: false,
    animationStep: 0
  }

  constructor (props: Props) {
    super(props)
    this.handleSequencerLastStep = this.handleSequencerLastStep.bind(this)
    this.handleStepChange = this.handleStepChange.bind(this)
  }

  handleSequencerLastStep (_args: RendererArgs) {
    this.setState({ sequencerHasLooped: true })
  }

  handleStepChange (args: RendererArgs) {
    const { step } = args
    this.setState({ animationStep: step })
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props, state } = this

    /* Classes and style */
    const wrapperClasses = bem(props.className)
      .block(this.clss)
      .mod({
        'show-first-block': state.animationStep >= 1,
        'show-second-block': state.animationStep >= 2,
        'show-third-block': state.animationStep >= 3
      })
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    const imageStyle: JSX.CSSProperties = {
      backgroundImage: `url(${props.bgImageUrl})`,
      backgroundSize: props.bgSize,
      backgroundPosition: props.bgPosition,
      opacity: props.bgOpacity
    }

    /* Display */
    return (
      <div
        className={wrapperClasses.value}
        style={wrapperStyle}>
        <Sequencer
          play={props.playAnimation && !state.sequencerHasLooped}
          sequence={[0, 1, 2, 3]}
          tempo={60}
          onStepChange={this.handleStepChange}
          onLastStep={this.handleSequencerLastStep}>
          {props.bgImageUrl && <div className={bem(this.clss).elt('image').value} style={imageStyle} />}
          {props.title && <h1 className={bem(this.clss).elt('title').value}>{props.title}</h1>}
          {props.kicker && <p className={bem(this.clss).elt('kicker').value}>{props.kicker}</p>}
          {props.intro && <p className={bem(this.clss).elt('intro').value}>{props.intro}</p>}
        </Sequencer>
      </div>
    )
  }
}

export type { Props }
export default Home
