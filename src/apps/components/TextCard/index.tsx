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
        {props.paragraph !== undefined && <p className={bem(this.clss).elt('text').value}>{props.paragraph}</p>}
        {props.readAlsoTitle !== undefined && <h4 className={bem(this.clss).elt('label').value}>{props.readAlsoTitle}</h4>}
        {props.readAlsoUrl !== undefined && <a className={bem(this.clss).elt('link').value} href={props.readAlsoUrl}>
          <span className={bem(this.clss).elt('link-content').value}>{props.readAlsoText}</span>
        </a>}
      </div>
    )
  }
}

export type { Props }
export default TextCard
