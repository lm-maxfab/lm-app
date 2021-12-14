import { Component, JSX, VNode } from 'preact'
import Img from '../../../modules/le-monde/components/Img'
import bem from '../../../modules/le-monde/utils/bem'
import { ChapterData } from '../../types'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  label?: ChapterData['label']
  teasing_label?: ChapterData['teasing_label']
  teasing?: ChapterData['teasing']
  title?: ChapterData['title']
  kicker?: ChapterData['kicker']
  image_url?: ChapterData['image_url']
  article_url?: ChapterData['article_url']
}

class Chapter extends Component<Props, {}> {
  static clss = 'prn-chapter'
  clss = Chapter.clss

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
        href={!props.teasing ? props.article_url : undefined}
        style={wrapperStyle}
        className={wrapperClasses.value}>
        <div className={bem(this.clss).elt('inner').value}>
          <div className={bem(this.clss).elt('left').value}>
            <Img src={props.image_url} />
          </div>
          <div className={bem(this.clss).elt('right').value}>
            <span>{props.teasing === true ? props.teasing_label : props.label}</span>
            <h2>{props.title}</h2>
            <p>{props.kicker}</p>
          </div>
        </div>
      </a>
    )
  }
}

export type { Props }
export default Chapter
