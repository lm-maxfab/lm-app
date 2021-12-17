import { Component, JSX } from 'preact'
import Img from '../../../modules/le-monde/components/Img'
import Svg from '../../../modules/le-monde/components/Svg'
import bem from '../../../modules/le-monde/utils/bem'
import { Destination as DestinationType } from '../../types'
import church from './assets/church.svg'
import churchShadow from './assets/church-shadow.svg'
import circles from './assets/circles.svg'
import circlesShadow from './assets/circles-shadow.svg'
import oval from './assets/oval.svg'
import ovalShadow from './assets/oval-shadow.svg'
import pill from './assets/pill.svg'
import pillShadow from './assets/pill-shadow.svg'

const shapes = {
  church,
  churchShadow,
  circles,
  circlesShadow,
  oval,
  ovalShadow,
  pill,
  pillShadow
}

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  fixedImage?: boolean
  forceBgCover?: boolean
  photoUrl: DestinationType['main_photo_url']
  shape: DestinationType['shape']
}

class DestinationWindow extends Component<Props, {}> {
  clss = 'dest22-destination-window'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Logic */
    const shapeName = props.shape ?? 'church'
    const shapeUrl = shapes[shapeName]
    const shapeShadowUrl = shapes[`${shapeName}Shadow`]

    /* Classes and style */
    const wrapperClasses = bem(props.className ?? '').block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }
    const bgStyle: JSX.CSSProperties = {
      backgroundSize: props.forceBgCover
        ? 'cover'
        : props.fixedImage
          ? 'cover'
          : 'contain',
      backgroundImage: `url(${props.photoUrl})`,
      backgroundAttachment: props.fixedImage === true ? 'fixed' : 'scroll',
      webkitMaskImage: `url(${shapeUrl})`
    }

    /* Display */
    return <div
      className={wrapperClasses.value}
      style={wrapperStyle}>
      <Img src={props.photoUrl} className={bem(this.clss).elt('hidden-image').value} />
      <div style={bgStyle} className={bem(this.clss).elt('bg-image').value}>
        <Svg src={shapeShadowUrl} />
      </div>
    </div>
  }
}

export type { Props }
export default DestinationWindow
