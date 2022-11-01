import { Component } from 'preact'
import bem from '../../../../modules/utils/bem'
import './styles.scss'

type Props = {
  className?: string,
  country?: string,
  surname?: string
}

type State = {
}

export default class GroupBlock extends Component<Props, State> {
  render () {
    return <div className={this.props.className}>
        <p>{this.props.country},</p>
        <p>{this.props.surname}</p>
    </div>
  }
}
