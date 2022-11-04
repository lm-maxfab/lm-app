import { Component } from 'preact'
import Flag from '../../Flag'
import bem from '../../../../modules/utils/bem'
import { TeamData } from '../../../types'
import './styles.scss'

type Props = {
  team?: TeamData
}

type State = {
}

export const className = bem('mondial-team-nav')

export default class TeamBlockNav extends Component<Props, State> {
  render () {
    return <a href={this.props.team?.url} className={className.value}>

        <div className={className.elt('header').value}>
          <Flag 
            iso={this.props.team?.iso}
          />
          <p className={className.elt('title').value}>{this.props.team?.country}</p>
        </div>

        <p className={className.elt('article').value}>{this.props.team?.article}</p>
        
    </a>
  }
}
