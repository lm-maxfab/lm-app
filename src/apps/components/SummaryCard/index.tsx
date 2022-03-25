import { Component, JSX, VNode } from 'preact'
import bem from '../../../modules/utils/bem'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  title?: VNode|string
  links?: Array<{text?: VNode|string, url?: string}>
}

class SummaryCard extends Component<Props, {}> {
  static clss = 'carto-twitter-summary-card'
  clss = SummaryCard.clss

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
        {props.links?.map(link => {
          return <a className={bem(this.clss).elt('link').value} href={link.url}>{link.text}</a>
        })}
      </div>
    )
  }
}

export type { Props }
export default SummaryCard
