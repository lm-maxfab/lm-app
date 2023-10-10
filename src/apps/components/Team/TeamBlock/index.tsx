import { Component } from 'preact'
import TeamTitle from '../TeamTitle'
import TeamImage from '../TeamImage'
import Flag from '../../Flag'
import bem from '../../../../modules/utils/bem'
import { TeamData } from '../../../types'
import './styles.scss'

type Props = {
  team?: TeamData
  cardCTA?: string
}

type State = {
}

export const className = bem('mondial-team')

export default class TeamBlock extends Component<Props, State> {
  render() {
    return <div className={className.value}>
      <Flag
        iso={this.props.team?.iso}
      />

      <TeamTitle
        className={className.elt('title')}
        country={this.props.team?.country}
      />

      <a href={this.props.team?.url}>
        <TeamImage
          className={className.elt('image')}
          cardCTA={this.props.cardCTA}
          iso={this.props.team?.iso}
        />
      </a>
    </div>
  }
}
