import { Component, JSX } from 'preact'
import Img from '../../../modules/le-monde/components/Img'
import bem from '../../../modules/le-monde/utils/bem'
import { Destination as DestinationType } from '../../types'
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

    /* Classes and style */
    const wrapperClasses = bem(props.className ?? '').block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }
    const bgStyle: JSX.CSSProperties = {
      backgroundImage: `url(${props.photoUrl})`,
      backgroundAttachment: props.fixedImage === true ? 'fixed' : 'scroll',
      webkitMaskImage: `url(${shapes[props.shape ?? 'church']})`,
    }

    /* Display */
    return <div
      className={wrapperClasses.value}
      style={wrapperStyle}>
      <Img src={props.photoUrl} className={bem(this.clss).elt('hidden-image').value} />
      <div style={bgStyle} className={bem(this.clss).elt('bg-image').value} />
    </div>
  }
}

export type { Props }
export default DestinationWindow
