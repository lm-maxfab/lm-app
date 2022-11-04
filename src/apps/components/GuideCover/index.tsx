import { Component, VNode } from 'preact'
import bem from '../../../modules/utils/bem'
import Marker from '../Marker'
import Circle from '../Circle'
import Gradient from '../Gradient'
import ScrollIcon from '../Icons/ScrollIcon'
import './styles.scss'

import getConfig from '../../../modules/utils/get-config'

const config = getConfig()

type Props = {
  title?: string | VNode,
  intro?: string,
}

type State = {
}

export const className = bem('mondial-guide-cover')

export default class GuideCover extends Component<Props, State> {
  render() {
    const imgCircle = `${config?.assets_root_url}/circle.svg`
    const imgPlayer1 = `${config?.assets_root_url}/cover-1.png`
    const imgPlayer2 = `${config?.assets_root_url}/cover-2.png`

    return <div className={className.value}>
      <div className={className.elt('container').value}>

        <div className={className.elt('circle').value}>
          <Circle></Circle>
        </div>

        <div className={className.elt('gradient').value}>
          <Gradient />

          <div className={className.elt('circle').mod('overlay').value}>
            <Circle></Circle>
          </div>

          <div className={className.elt('text').value}>
            <div className={className.elt('marker').value}>
              <Marker color='#fff' />
            </div>

            <p className={className.elt('title').value}>{this.props.title}</p>

            <div className={className.elt('scrollicon').value}>
              <ScrollIcon />
            </div>
          </div>
        </div>

      </div>

      <img className={className.elt('player').mod('left').value} src={imgPlayer1} />
      <img className={className.elt('player').mod('right').value} src={imgPlayer2} />

    </div>
  }
}
