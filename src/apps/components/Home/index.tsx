import { Component, JSX, VNode } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  bgImageUrl?: string
  bgSize?: string
  bgPosition?: string
  bgOpacity?: number
  title?: VNode
  kicker?: VNode
}

class Home extends Component<Props, {}> {
  static clss = 'illus21-home'
  clss = Home.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Classes and style */
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    const imageStyle: JSX.CSSProperties = {
      backgroundImage: `url(${props.bgImageUrl})`,
      backgroundSize: props.bgSize,
      backgroundPosition: props.bgPosition,
      opacity: props.bgOpacity
    }

    /* Display */
    return (
      <div
        className={wrapperClasses.value}
        style={wrapperStyle}>
        {props.bgImageUrl && <div className={bem(this.clss).elt('image').value} style={imageStyle} />}
        {props.title && <h1 className={bem(this.clss).elt('title').value}>{props.title}</h1>}
        {props.kicker && <p className={bem(this.clss).elt('kicker').value}>{props.kicker}</p>}
      </div>
    )
  }
}

export type { Props }
export default Home
