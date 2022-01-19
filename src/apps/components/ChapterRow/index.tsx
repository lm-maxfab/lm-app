import { Component, JSX } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'
import ImageBlock, { Props as ImageBlockProps } from '../ImageBlock'

import './styles.scss'

interface Blocks extends ImageBlockProps {
  size?: string
}

interface Props {
  className?: string
  style?: JSX.CSSProperties
  blocks?: Blocks[]
}

class ChapterRow extends Component<Props, {}> {
  static clss = 'illus21-chapter-row'
  clss = ChapterRow.clss

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
      <div className={wrapperClasses.value} style={wrapperStyle}>
        {props.blocks?.map(block => {
          const [num, denom] = (block.size ?? '1/1').split('/').map(e => parseFloat(e))
          const imageBlockStyle: JSX.CSSProperties = {
            width: `calc(${100 * (num ?? 1) / (denom ?? 1)} * var(--vw))`
          }
          return <div
            style={imageBlockStyle}
            className={bem(this.clss).elt('image-block').value}>
            {/* <ImageBlock
              layout={block.layout as 'text-on-left'|'text-under'}
              imageUrl={block.imageUrl}
              legendContent={block.legendContent}
              creditsContent={block.creditsContent}
              readAlsoContent={block.readAlsoContent}
              readAlsoUrl={block.readAlsoUrl} /> */}
          </div>})}
      </div>
    )
  }
}

export type { Props }
export default ChapterRow
