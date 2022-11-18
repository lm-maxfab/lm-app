import { Component } from 'preact'
import Gradient from '../../Gradient'
import bem from '../../../../modules/utils/bem'
import Svg from "../../../../modules/components/Svg";
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
      <div class={bemClass.elt('background-circle').value}>
        {/* <Svg src={circleSrc} width={undefined} height={undefined} /> */}
        <img
          src={circleSrc}
          className={bemClass.elt('circle').mod({ bg: true }).value} />
      </div>

      <div class={bemClass.elt('rectangle').value}>
        <Gradient></Gradient>

        <div class={bemClass.elt('rectangle-inner').value}>
          {/* <Svg src={circleSrc} width={undefined} height={undefined} /> */}
          <img
            src={circleSrc}
            className={bemClass.elt('circle').mod({ overlay: true }).value} />
        </div>
      </div>

      <div class={bemClass.elt('player').value} >
        <img src={playerSrc} alt="" />
      </div>

      <div class={bemClass.elt('overlay').value}>
        <p>Voir la fiche</p>
      </div>
    </div>
  }
}
