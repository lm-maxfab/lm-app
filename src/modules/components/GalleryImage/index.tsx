import { Component, VNode } from 'preact'
import styles from './styles.module.scss'

import Img from '../Img'
import ImageLegend from '../ImageLegend'
import { ImageProps } from '../Gallery'

interface Props extends ImageProps { }

class GalleryImage extends Component<Props, {}> {
  $legendWrapper: HTMLDivElement | null = null

  render() {
    const { props } = this

    const displayImageLegend = props.legend || props.credits

    const elementClasses = [styles['element']]
    const imageClasses = [styles['image']]

    const legendSpan = this.$legendWrapper?.querySelector('span')
    const legendHeight = legendSpan?.getBoundingClientRect().height

    const elementStyle = `
      --lm-gallery-img-legend-height: ${legendHeight}px;
    `

    return (
      <div
        class={elementClasses.join(' ')}
        style={elementStyle}
      >
        <div class={imageClasses.join(' ')}>
          <Img src={props.url} alt={props.alt} />
        </div>

        {displayImageLegend &&
          <div ref={n => { this.$legendWrapper = n }}>
            <ImageLegend legend={props.legend} credits={props.credits} />
          </div>
        }
      </div>
    )
  }
}

export type { Props }
export default GalleryImage
