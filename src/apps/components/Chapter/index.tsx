import { Component, JSX, VNode } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'

import './styles.scss'

interface ChapterData {
  supertitle?: VNode
  kicker?: VNode
  intro?: VNode
  credits?: VNode
  content?: string
}

interface Props {
  className?: string
  style?: JSX.CSSProperties
  data?: ChapterData
}

class Chapter extends Component<Props, {}> {
  static clss = 'covid-chapter'
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
        <div className={bem(this.clss).elt('images').value}></div>
        <div className={bem(this.clss).elt('content').value}>
          <div className={bem(this.clss).elt('supertitle').value}>{props.data?.supertitle}</div>
          <div className={bem(this.clss).elt('kicker').value}>{props.data?.kicker}</div>
          <div className={bem(this.clss).elt('intro').value}>{props.data?.intro}</div>
          <div className={bem(this.clss).elt('credits').value}>{props.data?.credits}</div>
          <div className={bem(this.clss).elt('content').value}>{props.data?.content}</div>
        </div>
      </div>
    )
  }
}

export type { Props }
export default Chapter
