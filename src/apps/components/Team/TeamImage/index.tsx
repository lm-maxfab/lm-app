import { Component } from 'preact'
import Gradient from '../../Gradient'
import bem from '../../../../modules/utils/bem'
import './styles.scss'

import getConfig from '../../../../modules/utils/get-config'

const config = getConfig()

type Props = {
  className?: any,
  iso?: string,
}

type State = {
}

export default class TeamImage extends Component<Props, State> {
  render() {

    const bemClass = this.props.className;

    const circleSrc = `${config?.assets_root_url}/circle-${this.props.iso}.svg`
    const playerSrc = `${config?.assets_root_url}/player-${this.props.iso}.png`
    // const playerSrc = `${config?.assets_root_url}/player-fra.png`

    return <div className={bemClass.value}>
      <img class={bemClass.elt('circle').value} src={circleSrc} alt="" />
      <div class={bemClass.elt('gradient').value}>
        <img class={bemClass.elt('circle').mod('overlay').value} src={circleSrc} alt="" />
        <Gradient />
      </div>
      <img class={bemClass.elt('player').value} src={playerSrc} alt="" />
      <div class={bemClass.elt('overlay').value}>
        <p>En savoir plus sur l'équipe</p>
      </div>
    </div>
  }
}
