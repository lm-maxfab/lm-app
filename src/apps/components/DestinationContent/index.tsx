import { Component, JSX } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'
import { Destination as DestinationType } from '../../types'
import DestinationLink from '../DestinationLink'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  content?: DestinationType['content']
  textColor?: DestinationType['contrast_color']
  bgColor?: DestinationType['main_color']
  borderColor?: DestinationType['contrast_color']
  url?: DestinationType['article_url']
}

class DestinationContent extends Component<Props, {}> {
  static clss = 'dest22-destination-content'
  clss = DestinationContent.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Classes and style */
    const wrapperClasses = bem(props.className ?? '').block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      ['--c-text-color']: props.textColor
    }

    /* Display */
    return (
      <div className={wrapperClasses.value} style={wrapperStyle}>
        {props.content}
        {props.url && <DestinationLink
          url={props.url}
          textColor={props.textColor}
          bgColor={props.bgColor}
          borderColor={props.borderColor} />}
      </div>
    )
  }
}

export type { Props }
export default DestinationContent