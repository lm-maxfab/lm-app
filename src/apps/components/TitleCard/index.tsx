import { Component, JSX, VNode } from 'preact'
import bem from '../../../modules/utils/bem'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  overhead?: VNode|string
  title?: VNode|string
}

class TitleCard extends Component<Props, {}> {
  static clss = 'carto-twitter-title-card'
  clss = TitleCard.clss

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
        {props.overhead !== undefined && <p className={bem(this.clss).elt('overhead').value}>{props.overhead}</p>}
        {props.title !== undefined && <h1 className={bem(this.clss).elt('title').value}>{props.title}</h1>}
      </div>
    )
  }
}

export type { Props }
export default TitleCard
