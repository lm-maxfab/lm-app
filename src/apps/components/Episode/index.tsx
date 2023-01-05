import { Component } from 'preact'
import bem from '../../../modules/utils/bem'
import { EpisodeData } from '../../types'
import { SheetBaseEntryValue } from '../../../modules/utils/sheet-base'
import './styles.scss'

type Props = {
  episode?: EpisodeData | SheetBaseEntryValue,
}

type State = {
}

export const className = bem('crim-footer-episode')

export default class GroupBlock extends Component<Props, State> {
  render() {

    const { episode } = this.props

    return <div>
      <p>
        <span>Épisode {episode?.id}</span>
        {!episode?.published && <span>À paraître le {episode?.date}</span>}
      </p>

      <div>
        <p>{episode?.title}</p>
      </div>

    </div>
  }
}
