import { Component, JSX } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'
import Chapter from '../Chapter'
import { ChapterData } from '../../Longform/types'

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
          return <Chapter {...chapterData} />
        })}
      </div>
    )
  }
}

export type { Props }
export default Chapters
