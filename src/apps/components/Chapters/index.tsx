import { Component, JSX } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'
import Chapter from '../Chapter'
import { ChapterData } from '../../types'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  chaptersData?: ChapterData[]
}

class Chapters extends Component<Props, {}> {
  static clss = 'prn-chapters'
  clss = Chapters.clss

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
      <div
        style={wrapperStyle}
        className={wrapperClasses.value}>
        {props.chaptersData?.map(chapterData => {
          const {
            label, teasing_label, teasing, title,
            kicker, image_url, article_url
          } = chapterData
          return <Chapter
            label={label}
            teasing_label={teasing_label}
            teasing={teasing}
            title={title}
            kicker={kicker}
            image_url={image_url}
            article_url={article_url} />
        })}
      </div>
    )
  }
}

export type { Props }
export default Chapters
