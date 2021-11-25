import { Component, JSX } from 'preact'
import Img from '../../../modules/le-monde/components/Img'
import { Props as StrToHtmlProps } from '../../../modules/le-monde/components/StrToHtml'
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
    if (props.data === undefined) return null
    const { data } = props

    /* Logic */
    const imagesAndAlts = [
      { image: data.image_1_url, alt: data.image_1_alt },
      { image: data.image_2_url, alt: data.image_2_alt },
      { image: data.image_3_url, alt: data.image_3_alt },
      { image: data.image_4_url, alt: data.image_4_alt }
    ].filter(({ image }) => image !== undefined && image !== '')
    
    const descriptionText = data.description !== undefined ? (data.description.props as StrToHtmlProps).content : ''

    /* Classes and style */
    const classes = bem(props.className ?? '').block(this.clss)
    const inlineStyle: JSX.CSSProperties = { ...props.style }
    const imagesClasses = bem(this.clss)
      .elt('images')
      .mod(`layout-of-${imagesAndAlts.length}`)

    /* Display */
    return (
      <div className={classes.value} style={inlineStyle}>
        <div className={imagesClasses.value}>
          {imagesAndAlts.map(imageAndAlt => (
            <Img src={imageAndAlt.image} alt={imageAndAlt.alt ?? descriptionText} />
          ))}
        </div>
        <div className={bem(this.clss).elt('text').value}>
          <span className={bem(this.clss).elt('description').value}>{data.description}</span>
          <span className={bem(this.clss).elt('credits').value}>{data.credits}</span>
        </div>
      </div>
    )
  }
}

export type { Props }
export default ImageBlock
