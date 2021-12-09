import { Component, JSX, VNode } from 'preact'
import Img from '../../../modules/le-monde/components/Img'
import bem from '../../../modules/le-monde/utils/bem'
import { ChapterData } from '../../Longform/types'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  number?: ChapterData['number']
  title?: ChapterData['title']
  kicker?: ChapterData['kicker']
  imageUrl?: ChapterData['imageUrl']
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
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    /* Display */
    return (
      <div className={wrapperClasses.value} style={wrapperStyle}>
        <div className={bem(this.clss).elt('left').value}>
          <Img src={props.imageUrl} />
        </div>
        <div className={bem(this.clss).elt('right').value}>
          <span>Épisode {props.number}</span>
          <h2>{props.title}</h2>
          <p>{props.kicker}</p>
        </div>
      </div>
    )
  }
}

export type { Props }
export default Chapter
