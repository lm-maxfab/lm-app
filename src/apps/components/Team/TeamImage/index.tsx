import { Component } from 'preact'
import bem from '../../../../modules/utils/bem'
import './styles.scss'

type Props = {
  className?: string,
  player?: string,
  background?: string
}

type State = {
}

export default class GroupBlock extends Component<Props, State> {
  render () {
    return <div className={this.props.className}>
        <p>[Image]</p>
        <p>{this.props.player}</p>
        <p>{this.props.background}</p>
    </div>
  }
}
