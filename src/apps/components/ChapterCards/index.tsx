import { Component, JSX } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'
import { ChapterData } from '../../types'
import ChapterCard from '../ChapterCard'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  chapters?: ChapterData[]
}

class ChapterCards extends Component<Props, {}> {
  static clss = 'prn-chapter-cards'
  clss = ChapterCards.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Classes and style */
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    /* Display */
    return (
      <div className={wrapperClasses.value} style={wrapperStyle}>
        {props.chapters?.map(chapter => {
          return <ChapterCard
            imageUrl={chapter.image_url}
            articleUrl={chapter.article_url}
            title={chapter.title}
            label={chapter.label}
            teasingLabel={chapter.teasing_label}
            teasing={chapter.teasing} />
        })}
      </div>
    )
  }
}

export type { Props }
export default ChapterCards
