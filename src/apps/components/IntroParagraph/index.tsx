import { Component, JSX, VNode } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  content: VNode
}

class IntroParagraph extends Component<Props, {}> {
  clss = 'dest22-intro-paragraph'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Classes and style */
    const wrapperClasses = bem(props.className ?? '').block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    /* Display */
    return <p
      style={wrapperStyle}
      className={wrapperClasses.value}>
      {props.content}
    </p>
  }
}

export type { Props }
export default IntroParagraph
