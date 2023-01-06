import { Component } from 'preact'
import bem from '../../../modules/utils/bem'
import { EpisodeData } from '../../types'
import { SheetBaseEntryValue } from '../../../modules/utils/sheet-base'
import './styles.scss'

type Props = {
  episode?: EpisodeData,
}

type State = {
}

export const className = bem('crim-footer__episode')

export default class Episode extends Component<Props, State> {
  render() {

    const { episode } = this.props

    const isPublishedClass = episode?.published ? 'crim-footer__episode--published' : 'crim-footer__episode'

    const classList = `crim-footer__episode ${isPublishedClass}`

    return <div class={classList}>
      <p class="crim-footer__episode_surtitle">
        <span>Épisode {episode?.id}</span>
        {!episode?.published && <span class="crim-footer__episode_publication_infos">À paraître le {episode?.date}</span>}
      </p>

      <div class="crim-footer__episode_card">
        <a href={episode?.url}>
          <div class="crim-footer__episode_cover">
            <img src={episode?.cover} alt="" />
          </div>
          <p class="crim-footer__episode_title">{episode?.title}</p>
        </a>
      </div>

    </div>
  }
}
