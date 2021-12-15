import { Component, JSX } from 'preact'
import Img from '../../../modules/le-monde/components/Img'
import bem from '../../../modules/le-monde/utils/bem'
import { ChapterData } from '../../types'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  imageUrl?: ChapterData['image_url']
  articleUrl?: ChapterData['article_url']
  title?: ChapterData['title']
  label?: ChapterData['label']
  teasingLabel?: ChapterData['teasing_label']
  teasing?: ChapterData['teasing']
}

class ChapterCard extends Component<Props, {}> {
  static clss = 'prn-chapter-card'
  clss = ChapterCard.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Classes and style */
    const wrapperClasses = bem(props.className)
      .block(this.clss)
      .mod({ teasing: props.teasing })
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    /* Display */
    return (
      <a
        href={!props.teasing ? props.articleUrl : undefined}
        style={wrapperStyle}
        className={wrapperClasses.value}>
        <div className={bem(this.clss).elt('image-slot').value}>
          <Img src={props.imageUrl} />
          {props.teasing && <div className={bem(this.clss).elt('image-opacifier').value} />}
          {props.teasing && <span className={bem(this.clss).elt('teasing-label').value}>{props.teasingLabel}</span>}
        </div>
        <span className={bem(this.clss).elt('label').value}>{props.label}</span>
        <h4 className={bem(this.clss).elt('title').value}>{props.title}</h4>
      </a>
    )
  }
}

export type { Props }
export default ChapterCard
