import { Component, JSX } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'
import { Destination as DestinationType } from '../../types'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  value: number
  borderColor: DestinationType['contrast_color']
  bgColor: DestinationType['main_color']
  textColor: DestinationType['contrast_color']
}

class DestinationNumber extends Component<Props, {}> {
  clss = 'dest22-destination-number'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Classes and style */
    const wrapperClasses = bem(props.className ?? '').block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      ['--c-border-color']: props.borderColor,
      ['--c-bg-color']: props.bgColor,
      ['--c-text-color']: props.textColor
    }

    /* Display */
    return (
      <div
        style={wrapperStyle}
        className={wrapperClasses.value}>
        <span>{props.value}</span>
      </div>
    )
  }
}

export type { Props }
export default DestinationNumber
