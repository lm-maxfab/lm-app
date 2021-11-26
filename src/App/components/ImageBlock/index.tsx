import { Component, JSX } from 'preact'
import Img from '../../../modules/le-monde/components/Img'
import bem from '../../../modules/le-monde/utils/bem'
import { ImageBlockData } from '../../types'
import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  data?: ImageBlockData
}

class ImageBlock extends Component<Props, {}> {
  clss = 'photos21-image-block'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this
    const { data } = props

    /* Logic */
    if (data === undefined) return null
    if (data.image_url === undefined) return null

    /* Classes and style */
    const classes = bem(props.className ?? '').block(this.clss)
    const inlineStyle: JSX.CSSProperties = { ...props.style }
    const imageClasses = bem(this.clss).elt('image').mod({
      ['ratio-pano']: /^pan/.test(data.image_ratio?.toLowerCase() ?? ''),
      ['ratio-landscape']: /^pay/.test(data.image_ratio?.toLowerCase() ?? ''),
      ['ratio-square']: /^c/.test(data.image_ratio?.toLowerCase() ?? ''),
      ['ratio-portrait']: /^po/.test(data.image_ratio?.toLowerCase() ?? ''),
      ['ratio-strip']: /^s/.test(data.image_ratio?.toLowerCase() ?? '')
    })

    /* Display */
    return (
      <div className={classes.value} style={inlineStyle}>
        <div className={bem(this.clss).elt('inner').value}>
          <Img
            className={imageClasses.value}
            src={data.image_url}
            alt={data.description} />
          <div className={bem(this.clss).elt('text').value}>
            <span className={bem(this.clss).elt('description').value}>{data.description + ' '}</span>
            <span className={bem(this.clss).elt('credits').value}>{data.credits}</span>
          </div>
        </div>
      </div>
    )
  }
}

export type { Props }
export default ImageBlock
