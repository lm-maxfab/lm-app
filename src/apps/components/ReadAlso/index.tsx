import { Component, JSX, VNode } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  url?: string
  content?: VNode
}

class ReadAlso extends Component<Props, {}> {
  static clss = 'illus21-read-also'
  clss = ReadAlso.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Classes and style */
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    /* Display */
    return <>{props.content && <a
      href={props.url}
      className={wrapperClasses.value}
      style={wrapperStyle}>
      {props.content}
    </a>}</>
  }
}

export type { Props }
export default ReadAlso
