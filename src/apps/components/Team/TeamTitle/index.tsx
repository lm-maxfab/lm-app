import { Component } from 'preact'
import bem from '../../../../modules/utils/bem'
import './styles.scss'

type Props = {
  className?: any,
  country?: string,
  surname?: string
}

type State = {
}

export default class TeamTitle extends Component<Props, State> {
  render () {
    return <div className={this.props.className.value}>
        <p>{this.props.country},</p>
        <p>{this.props.surname}</p>
    </div>
  }
}
