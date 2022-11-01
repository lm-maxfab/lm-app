import { Component } from 'preact'
import bem from '../../../../modules/utils/bem'
import './styles.scss'

type Props = {
  group?: string,
  className?: string
}

type State = {
}

export default class GroupTab extends Component<Props, State> {
  render () {
    return <div className={this.props.className}>
        <p>Groupe {this.props.group}</p>
    </div>
  }
}
