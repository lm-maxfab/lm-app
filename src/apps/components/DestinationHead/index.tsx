import { Component, JSX } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'
import { Destination as DestinationType } from '../../types'
import DestinationWindow from '../DestinationWindow'
import DestinationNumber from '../DestinationNumber'
import DestinationSupertitle from '../DestinationSupertitle'
import DestinationTitle from '../DestinationTitle'
import DestinationOpener from '../DestinationOpener'
import church from './assets/church.svg'
import circles from './assets/circles.svg'
import oval from './assets/oval.svg'
import pill from './assets/pill.svg'

const shapes = { church, circles, oval, pill }

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  fixedImage?: boolean
  photoUrl?: DestinationType['main_photo_url']
  shape?: DestinationType['shape']
  borderColor?: DestinationType['contrast_color']
  bgColor?: DestinationType['main_color']
  textColor?: DestinationType['contrast_color']
  position?: number
  title?: DestinationType['title']
  supertitle?: DestinationType['supertitle']
  isOpened?: boolean
  onOpenerClick?: (e: JSX.TargetedMouseEvent<HTMLButtonElement>) => void
}

class DestinationHead extends Component<Props, {}> {
  clss = 'dest22-destination-head'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Classes and style */
    const wrapperClasses = bem(props.className ?? '').block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    /* Display */
    return (
      <div
        style={wrapperStyle}
        className={wrapperClasses.value}>
        <DestinationWindow
          fixedImage={props.fixedImage}
          photoUrl={props.photoUrl}
          shape={props.shape} />
        <DestinationNumber
          value={props.position}
          borderColor={props.borderColor}
          bgColor={props.bgColor}
          textColor={props.textColor} />
        <DestinationSupertitle
          content={props.supertitle}
          textColor={props.textColor} />
        <DestinationTitle
          content={props.title}
          textColor={props.textColor} />
        <DestinationOpener
          isOpened={props.isOpened}
          bgColor={props.bgColor}
          borderColor={props.borderColor}
          onClick={this.props.onOpenerClick} />
      </div>
    )
  }
}

export type { Props }
export default DestinationHead
