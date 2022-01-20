import { Component, JSX, VNode } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'
import ImageCredits from '../ImageCredits'
import Image from '../Image'
import Legend from '../Legend'
import ReadAlso from '../ReadAlso'
import isNullish from '../../../modules/le-monde/utils/is-nullish'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  layout?: 'text-on-left'|'text-under'
  imageUrl?: string
  legendContent?: VNode|string
  creditsContent?: VNode|string
  readAlsoContent?: VNode|string
  readAlsoUrl?: string
}

class ImageBlock extends Component<Props, {}> {
  static clss = 'illus21-image-block'
  clss = ImageBlock.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Classes and style */
    const wrapperClasses = bem(props.className)
      .block(this.clss)
      .mod({
        'text-on-left': props.layout === 'text-on-left',
        'text-under': props.layout === 'text-under' || isNullish(props.layout)
      })
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    /* Display */
    return (
      <div
        className={wrapperClasses.value}
        style={wrapperStyle}>
        <div className={bem(this.clss).elt('image').value}>
          <Image url={props.imageUrl} />
        </div>
        <div className={bem(this.clss).elt('legend').value}>
          <Legend content={props.legendContent} />
        </div>
        <div className={bem(this.clss).elt('credits').value}>
          <ImageCredits content={props.creditsContent} />
        </div>
        <div className={bem(this.clss).elt('read-also').value}>
          <ReadAlso
            url={props.readAlsoUrl}
            content={props.readAlsoContent} />
        </div>
      </div>
    )
  }
}

export type { Props }
export default ImageBlock
