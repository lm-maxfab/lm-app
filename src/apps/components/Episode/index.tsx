import { Component } from 'preact'
import { EpisodeData } from '../../types'
import styles from './styles.module.scss'

type Props = {
  episode?: EpisodeData,
}

type State = {}

export default class Episode extends Component<Props, State> {
  render() {
    const { episode } = this.props

    const episodeClasses = [
      'lm-footer__episode',
      styles['episode']
    ]

    const episodeCardClasses = [
      'lm-footer__episode_card',
      styles['episode_card']
    ]

    const episodeCoverClasses = [
      'lm-footer__episode_cover',
      styles['episode_cover']
    ]

    const episodeTextTopClasses = [
      'lm-footer__episode_text-top',
      styles['episode_text-top']
    ]

    const episodeTextCardClasses = [
      'lm-footer__episode_text-card',
      styles['episode_text-card']
    ]

    const episodeTextBottomClasses = [
      'lm-footer__episode_text-bottom',
      styles['episode_text-bottom']
    ]

    if (episode?.published) {
      episodeClasses.push(styles['episode-published'])
      episodeClasses.push('lm-footer__episode--published')
    }

    return <div className={episodeClasses.join(' ')}>

      {episode?.text_top && <p className={episodeTextTopClasses.join(' ')}>{episode?.text_top}</p>}

      <div className={episodeCardClasses.join(' ')}>
        <a href={episode?.url ?? ''}>
          <div className={episodeCoverClasses.join(' ')}>
            <img src={episode?.cover} alt="" />
          </div>

          {episode?.text_card && <p className={episodeTextCardClasses.join(' ')}>{episode?.text_card}</p>}
        </a>
      </div>

      {episode?.text_bottom && <p className={episodeTextBottomClasses.join(' ')}>{episode?.text_bottom}</p>}

    </div>
  }
}
