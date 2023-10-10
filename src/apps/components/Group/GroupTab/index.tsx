import { Component } from 'preact'
import bem from '../../../../modules/utils/bem'
import './styles.scss'

type Props = {
  group?: string,
  groupTitle?: string,
  className?: string
}

type State = {
}

export default class GroupTab extends Component<Props, State> {
  render() {
    const bemClass = bem(this.props.className)

    const shapeSrc = "https://assets-decodeurs.lemonde.fr/redacweb/51-2309-mondial-rugby/shape-eng.svg"

    return <div className={bemClass.value}>
      <div className={bemClass.elt('desktop').value}>
        <h3>{this.props.groupTitle}{' '}{this.props.group}</h3>
      </div>

      <div className={bemClass.elt('mobile').value}>
        <img src={shapeSrc} />
        <h3>{this.props.groupTitle}{' '}{this.props.group}</h3>
      </div>
    </div>
  }
}
