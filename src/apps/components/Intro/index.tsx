import { Component, JSX, VNode } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  isActive?: boolean
  content?: VNode|string
}

class Intro extends Component<Props, {}> {
  static clss = 'covid-intro'
  clss = Intro.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Classes and style */
    const wrapperClasses = bem(props.className)
      .block(this.clss)
      .mod({ inactive: !props.isActive })
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    /* Display */
    return (
      <div
        style={wrapperStyle}
        className={wrapperClasses.value}>
        {props.content}
      </div>
    )
  }
}

export type { Props }
export default Intro
