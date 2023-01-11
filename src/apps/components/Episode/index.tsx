import { Component } from 'preact'
import { EpisodeData } from '../../types'
import styles from './styles.module.scss'

type Props = {
  episode?: EpisodeData,
}

type State = { }

export default class Episode extends Component<Props, State> {
  render() {
    const { episode } = this.props

    const episodeClasses = [styles['episode']]
    if (episode?.published) episodeClasses.push(styles['episode-published'])

    return <div className={episodeClasses.join(' ')}>

      {episode?.text_top && <p className={styles["episode_text-top"]}>{episode?.text_top}</p>}

      <div className={styles["episode_card"]}>
        <a href={episode?.url ?? ''}>
          <div className={styles["episode_cover"]}>
            <img src={episode?.cover} alt="" />
          </div>

          {episode?.text_card && <p className={styles["episode_text-card"]}>{episode?.text_card}</p>}
        </a>
      </div>

      {episode?.text_bottom && <p className={styles["episode_text-bottom"]}>{episode?.text_bottom}</p>}

    </div>
  }
}
