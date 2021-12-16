import { Component, JSX } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'
import { CreditsData, Destination as DestinationType } from '../../types'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  content?: CreditsData['content']
  bgColor?: DestinationType['main_color']
  textColor?: DestinationType['contrast_color']
}

class Credits extends Component<Props, {}> {
  static clss = 'dest22-credits'
  clss = Credits.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Classes and style */
    const wrapperClasses = bem(props.className ?? '').block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      backgroundColor: props.bgColor,
      color: props.textColor
    }

    /* Display */
    return (
      <div className={wrapperClasses.value} style={wrapperStyle}>
        <div className={bem(this.clss).elt('inner').value}>{props.content}</div>
      </div>
    )
  }
}

export type { Props }
export default Credits
