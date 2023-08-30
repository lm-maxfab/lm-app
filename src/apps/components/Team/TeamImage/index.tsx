import { Component } from 'preact'
import Gradient from '../../Gradient'
import bem from '../../../../modules/utils/bem'
import Svg from "../../../../modules/components/Svg"
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

    // const shapeSrc = `${config?.assets_root_url}/shape-${this.props.iso}.svg`
    // const playerSrc = `${config?.assets_root_url}/player-${this.props.iso}.png`
    const shapeSrc = `${config?.assets_root_url}/shape-eng.svg`
    const playerSrc = `${config?.assets_root_url}/player-eng.png`

    return <div className={bemClass.value}>
      <img
        src={shapeSrc}
        className={bemClass.elt('shape').value} />

      <Gradient></Gradient>

      <div class={bemClass.elt('player').value} >
        <img src={playerSrc} alt="" />
      </div>
      <div class={bemClass.elt('overlay').value}>
        <p>Voir la fiche</p>
      </div>
    </div>
  }
}
