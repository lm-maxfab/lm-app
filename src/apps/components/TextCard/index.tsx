import { Component, JSX, VNode } from 'preact'
import bem from '../../../modules/utils/bem'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  paragraph?: VNode|string
  readAlsoTitle?: VNode|string
  readAlsoText?: VNode|string
  readAlsoUrl?: string
}

class TextCard extends Component<Props, {}> {
  static clss = 'carto-twitter-text-card'
  clss = TextCard.clss

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
        <p>{props.paragraph}</p>
        <h4>{props.readAlsoTitle}</h4>
        <a href={props.readAlsoUrl}>{props.readAlsoText}</a>
      </div>
    )
  }
}

export type { Props }
export default TextCard
