import { Component, JSX } from 'preact'
import bem from '../../utils/bem'
import Img from '../Img'

import './styles.scss'

interface Image {
  slotHeight?: JSX.CSSProperties['height']
  width?: JSX.CSSProperties['width']
  height?: JSX.CSSProperties['height']
  fit?: JSX.CSSProperties['objectFit']
  position?: JSX.CSSProperties['objectPosition']
  hPos?: string
  vPos?: string
  zIndex?: JSX.CSSProperties['zIndex']
  url?: string
  loading?: 'lazy'|'eager'
}

interface Props {
  className?: string
  style?: JSX.CSSProperties
  images?: Image[]
}

class ImageFlow extends Component<Props, {}> {
  static clss = 'lm-image-flow'
  clss = ImageFlow.clss

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
      <div
      style={wrapperStyle}
        className={wrapperClasses.value}>
        {props.images?.map(image => {
          const slotStyle: JSX.CSSProperties = { height: image.slotHeight }
          const imageStyle: JSX.CSSProperties = {
            width: image.width,
            height: image.height ?? '100%',
            objectFit: image.fit ?? 'cover',
            objectPosition: image.position ?? 'center',
            left: image.hPos ?? '50%',
            top: image.vPos ?? '50%',
            transform: `translate(calc(-1 * ${image.hPos}), calc(-1 * ${image.vPos}))`,
            zIndex: image.zIndex,
          }
          return <div
            style={slotStyle}
            className={bem(this.clss).elt('image').value}>
            <Img
              src={image.url}
              style={imageStyle}
              loading={image.loading ?? 'lazy'} />
          </div>
        })}
      </div>
    )
  }
}

export type { Props, Image }
export default ImageFlow
