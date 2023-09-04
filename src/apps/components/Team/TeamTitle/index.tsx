import { Component } from 'preact'
import bem from '../../../../modules/utils/bem'
import './styles.scss'

type Props = {
  className?: any,
  country?: string,
}

type State = {
}

export default class TeamTitle extends Component<Props, State> {
  render () {
    return <div className={this.props.className.value}>
        <h4>{this.props.country}</h4>
    </div>
  }
}