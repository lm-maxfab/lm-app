import { Component, JSX, VNode } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  isActive?: boolean
  content?: VNode|string
}

class Title extends Component<Props, {}> {
  static clss = 'covid-title'
  clss = Title.clss

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
      <h1
        style={wrapperStyle}
        className={wrapperClasses.value}>
        {props.content}
      </h1>
    )
  }
}

export type { Props }
export default Title
