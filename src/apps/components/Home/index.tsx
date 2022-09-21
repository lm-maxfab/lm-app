import { Component, JSX, VNode } from 'preact'
import Sequencer, { RendererArgs } from '../../../modules/le-monde/components/Sequencer'
import bem from '../../../modules/le-monde/utils/bem'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  bgImageUrl?: string
  bgImageMobileUrl?: string
  bgSize?: string
  bgPosition?: string
  bgOpacity?: number
  title?: VNode|string
  kicker?: VNode|string
  intro?: VNode|string
  playAnimation?: boolean
  hideImage?: boolean
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
    const { value } = args
    this.setState({ animationStep: value })
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props, state } = this

    /* Logic */
    const playAnimation = props.playAnimation
      && !state.sequencerHasLooped

    /* Classes and style */
    const wrapperClasses = bem(props.className)
      .block(this.clss)
      .mod({
        'show-opacifier': state.animationStep >= 1,
        'show-title': state.animationStep >= 3,
        'show-kicker': state.animationStep >= 5,
        'show-intro': state.animationStep >= 9,
        'hide-image': props.hideImage
      })
    const wrapperStyle: JSX.CSSProperties = { ...props.style }
    const imageStyle: JSX.CSSProperties = {
      backgroundImage: `url(${props.bgImageUrl})`,
      backgroundSize: props.bgSize,
      backgroundPosition: props.bgPosition,
      '--img-opacity': props.bgOpacity
    }
    const mobileImageStyle: JSX.CSSProperties = {
      backgroundImage: `url(${props.bgImageMobileUrl})`,
      backgroundSize: props.bgSize,
      backgroundPosition: props.bgPosition,
      '--img-opacity': props.bgOpacity
    }

    /* Display */
    return (
      <div
        className={wrapperClasses.value}
        style={wrapperStyle}>
        <Sequencer
          play={playAnimation}
          length={15}
          tempo={140}
          onStepChange={this.handleStepChange}
          onLastStep={this.handleSequencerLastStep}>
          {props.bgImageUrl && <div className={bem(this.clss).elt('image').mod('desktop').value} style={imageStyle} />}
          {props.bgImageMobileUrl && <div className={bem(this.clss).elt('image').mod('mobile').value} style={mobileImageStyle} />}
          <div className={bem(this.clss).elt('opacifier').value} />
          <div className={bem(this.clss).elt('text-wrapper').value}>
            {props.title && <h1 className={bem(this.clss).elt('title').value}>{props.title}</h1>}
            {props.kicker && <p className={bem(this.clss).elt('kicker').value}>{props.kicker}</p>}
            {/* {props.intro && <p className={bem(this.clss).elt('intro').value}>{props.intro}</p>} */}
          </div>
        </Sequencer>
      </div>
    )
  }
}

export type { Props }
export default Home
