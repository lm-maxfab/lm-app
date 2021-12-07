import { Component, JSX } from 'preact'
import Svg from '../../../modules/le-monde/components/Svg'
import bem from '../../../modules/le-monde/utils/bem'
import iconUrl from './assets/icon-2.svg'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  isOpened?: boolean
  bgColor?: string
  borderColor?: string
  onClick?: (e: JSX.TargetedMouseEvent<HTMLButtonElement>) => void
}

class DestinationOpener extends Component<Props, {}> {
  clss = 'dest22-destination-opener'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Classes and style */
    const wrapperClasses = bem(props.className ?? '')
      .block(this.clss)
      .mod({ opened: props.isOpened ?? false })

    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      ['--c-icon-bg']: props.bgColor,
      ['--c-icon-border']: props.borderColor
    }

    /* Display */
    return (
      <button
        className={wrapperClasses.value}
        style={wrapperStyle}
        onClick={this.props.onClick}>
        <Svg src={iconUrl} />
      </button>
    )
  }
}

export type { Props }
export default DestinationOpener
