import { Component, JSX, VNode } from 'preact'
import bem from '../../../modules/utils/bem'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  title?: VNode|string
  paragraph?: VNode|string
}

class FurtherReadingCard extends Component<Props, {}> {
  static clss = 'carto-twitter-further-reading-card'
  clss = FurtherReadingCard.clss

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
        <h4 className={bem(this.clss).elt('title').value}>{props.title}</h4>
        <p className={bem(this.clss).elt('text').value}>{props.paragraph}</p>
      </div>
    )
  }
}

export type { Props }
export default FurtherReadingCard
