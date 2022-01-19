import { Component, JSX, VNode } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  title?: VNode
  kicker?: VNode
}

class ChapterHead extends Component<Props, {}> {
  static clss = 'illus21-chapter-head'
  clss = ChapterHead.clss

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
        {props.title && <h2 className={bem(this.clss).elt('title').value}>{props.title}</h2>}
        {props.kicker && <p className={bem(this.clss).elt('kicker').value}>{props.kicker}</p>}
      </div>
    )
  }
}

export type { Props }
export default ChapterHead
