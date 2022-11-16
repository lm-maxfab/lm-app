import { Component, VNode } from 'preact'
import Gradient from '../../Gradient'
import Circle from '../../Circle'
import Marker from '../../Marker'
import ScrollIcon from '../../Icons/ScrollIcon'
import bem from '../../../../modules/utils/bem'
import './styles.scss'

import getConfig from '../../../../modules/utils/get-config'

const config = getConfig()

type Props = {
  currentStep?: number,
  title?: string | VNode,
  intro?: string | VNode,
}

type State = {
}


interface Cover {
  stepClass?: string,
  lastStep?: undefined | number,
}

export const className = bem('mondial-guide-cover')

class Cover extends Component<Props, State> {
  state: State = {
  }

  constructor(props: Props) {
    super(props)
    this.stepClass = 'init'
    this.lastStep = undefined
  }

  componentDidUpdate(): void {
    this.lastStep = this.props.currentStep ?? 0
  }

  render() {
    const imgPlayer1 = `${config?.assets_root_url}/player-wls-cover.png`
    const imgPlayer2 = `${config?.assets_root_url}/player-can-cover.png`

    if (this.lastStep === 0 && this.props.currentStep === 1) {
      this.stepClass = 'out'
    } else if (this.props.currentStep === 0 && this.stepClass != 'init') {
      this.stepClass = 'back'
    }

    return <div className={className.mod(this.stepClass).value}>

      <div className={className.elt('circle').value}>
        <Circle></Circle>
      </div>

      <div className={className.elt('container').value}>

        <div className={className.elt('gradient').value}>

          <Gradient />

          <div className={className.elt('circle').mod('overlay').value}>
            <Circle></Circle>
          </div>

        </div>

        <div className={className.elt('text-container').value}>

          <div className={className.elt('text').value}>

            <div>
              <div className={className.elt('marker').value}>
                <Marker color='#fff' />
              </div>
              <h1 className={className.elt('title').value}>{this.props.title}</h1>
              <div className={className.elt('scrollicon').value}>
                <ScrollIcon />
              </div>
            </div>
            <div>
              <h2 className={className.elt('intro').value}>{this.props.intro}</h2>
            </div>

          </div>

        </div>

        <div className={className.elt('players').value}>
          <img className={className.elt('player').mod('left').value} src={imgPlayer1} />
          <img className={className.elt('player').mod('right').value} src={imgPlayer2} />
        </div>
      </div>
    </div>
  }
}

export default Cover