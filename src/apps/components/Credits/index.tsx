import { Component, JSX, VNode } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  content?: VNode
}

class Credits extends Component<Props, {}> {
  static clss = 'illus21-credits'
  clss = Credits.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Classes and style */
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    /* Display */
    return <>{props.content && <p
      className={wrapperClasses.value}
      style={wrapperStyle}>
      {props.content}
    </p>}</>
  }
}

export type { Props }
export default Credits
