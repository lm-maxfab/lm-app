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

    // const shapeSrc = `https://assets-decodeurs.lemonde.fr/redacweb/51-2309-mondial-rugby/shape-${this.props.iso}.svg`
    // const playerSrc = `https://assets-decodeurs.lemonde.fr/redacweb/51-2309-mondial-rugby/player-${this.props.iso}.png`
    const shapeSrc = 'https://assets-decodeurs.lemonde.fr/redacweb/51-2309-mondial-rugby/shape-eng.svg'
    const playerSrc = 'https://assets-decodeurs.lemonde.fr/redacweb/51-2309-mondial-rugby/player-eng.png'

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
