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

    const footerClass = `outoc-footer`

    const episodeClasses = [`${footerClass}__episode`, styles['episode'], 'lm-footer__episode']

    if (episode?.published) {
      episodeClasses.push(`${footerClass}__episode_published`)
      episodeClasses.push(styles['episode-published'])
      episodeClasses.push('lm-footer__episode--published')
    }

    const episodeCardClasses = [`${footerClass}__episode__card`, styles["episode_card"]]
    const episodeCoverClasses = [`${footerClass}__episode__cover`, styles["episode_cover"]]
    const episodeTextTopClasses = [`${footerClass}__episode__text-top`, styles["episode_text-top"]]
    const episodeTextCardClasses = [`${footerClass}__episode__text-card`, styles["episode_text-card"]]
    const episodeTextBottomClasses = [`${footerClass}__episode__text-bottom`, styles["episode_text-bottom"]]

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
