import { Component, JSX, VNode } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  url?: string
  content?: VNode|string
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
    return <>{props.content && <div
      className={wrapperClasses.value}
      style={wrapperStyle}>
      <div className={bem(this.clss).elt('label').value}>
        Lire :
      </div>
      <a
        className={bem(this.clss).elt('link').value}
        href={props.url}>
        {props.content}
      </a>
    </div>}</>
  }
}

export type { Props }
export default ReadAlso
