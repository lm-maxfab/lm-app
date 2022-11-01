import { Component } from 'preact'
import GroupTab from '../GroupTab'
import TeamBlock from '../../Team/TeamBlock'
import bem from '../../../../modules/utils/bem'
import { TeamData } from '../../../types'
import './styles.scss'

type Props = {
  group?: string
  teams?: TeamData[]
}

type State = {
}

export const className = bem('mondial-group')

export default class GroupBlock extends Component<Props, State> {
  render () {
    return <div className={className.value}>
          <GroupTab 
            className={className.elt('tab').value} 
            group={this.props.group} 
          />
          <div className={className.elt('grid').value}>
            {this.props.teams?.map(team => {
              return <TeamBlock 
                team={team}
              />
            })}
          </div>
    </div>
  }
}
