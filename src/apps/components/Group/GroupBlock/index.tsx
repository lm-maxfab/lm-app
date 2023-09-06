import { Component } from 'preact'
import GroupTab from '../GroupTab'
import TeamBlock from '../../Team/TeamBlock'
import TeamBlockNav from '../../Team/TeamBlockNav'
import bem from '../../../../modules/utils/bem'
import { TeamData } from '../../../types'
import './styles.scss'

type Props = {
  group?: string,
  groupTitle?: string,
  cardCTA?: string,
  teams?: TeamData[],
  nav?: boolean
}

type State = {
}

export const className = bem('mondial-group')

export default class GroupBlock extends Component<Props, State> {
  render() {

    const groupClasses = className.mod({
      'navbar': this.props.nav,
      'default': !this.props.nav,
    })

    return <div className={groupClasses.value}>
      <div className={groupClasses.elt('teams').value}>
        <GroupTab
          className={groupClasses.elt('tab').value}
          groupTitle={this.props.groupTitle}
          group={this.props.group}
        />

        {this.props.teams?.map(team => {
          return this.props.nav
            ? <TeamBlockNav team={team} />
            : <TeamBlock
              team={team}
              cardCTA={this.props.cardCTA}
            />
        })}
      </div>
    </div>
  }
}
