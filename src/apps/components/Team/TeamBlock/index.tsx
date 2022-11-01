import { Component } from 'preact'
import TeamTitle from '../TeamTitle'
import TeamImage from '../TeamImage'
import Flag from '../../Flag'
import bem from '../../../../modules/utils/bem'
import { TeamData } from '../../../types'
import './styles.scss'

type Props = {
  team?: TeamData
}

type State = {
}

export const className = bem('mondial-team')

export default class GroupBlock extends Component<Props, State> {
  render () {
    return <div className={className.value}>
        <Flag 
          iso={this.props.team?.iso}
        />

        <TeamTitle
          className={className.elt('title').value}
          country={this.props.team?.country}
          surname={this.props.team?.surname}
        />
        
        <TeamImage 
          className={className.elt('image').value}
          player={this.props.team?.player}
          background={this.props.team?.background}
        />
    </div>
  }
}
