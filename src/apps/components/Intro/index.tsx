import { Component, JSX, VNode } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  title?: VNode
  paragraph?: VNode
}

class Intro extends Component<Props, {}> {
  static clss = 'prn-intro'
  clss = Intro.clss

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
        <h1>{props.title}</h1>
        <p>{props.paragraph}</p>
      </div>
    )
  }
}

export type { Props }
export default Intro
