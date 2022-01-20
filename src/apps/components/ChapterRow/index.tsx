import { Component, JSX } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'
import ImageBlock, { Props as ImageBlockProps } from '../ImageBlock'

import './styles.scss'

interface Block extends ImageBlockProps {
  size?: string
}

interface Props {
  className?: string
  style?: JSX.CSSProperties
  blocks?: Block[]
}

class ChapterRow extends Component<Props, {}> {
  static clss = 'illus21-chapter-row'
  clss = ChapterRow.clss
  $root: HTMLDivElement|null = null

  /* * * * * * * * * * * * * * *
   * LIFECYCLE
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
    this.horizontalScrollListener = this.horizontalScrollListener.bind(this)
    this.requestHorizontalScrollToggle = this.requestHorizontalScrollToggle.bind(this)
  }

  componentDidMount () {
    if (this.$root !== null) {
      this.$root.onscroll = this.horizontalScrollListener
    }
  }

  /* * * * * * * * * * * * * * *
   * METHODS
   * * * * * * * * * * * * * * */
  horizontalScrollListener (event: Event) {
    this.requestHorizontalScrollToggle()
  }

  requestHorizontalScrollToggle () {
    console.log('request h scroll toggle')
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Logic */
    const contentWidth = props.blocks?.reduce((acc: number, block: Block) => {
      const [num, denom] = (block.size ?? '1/1').split('/').map(e => parseFloat(e))
      return acc + (num ?? 1) / (denom ?? 1)
    }, 0)
    console.log(contentWidth)

    /* Classes and style */
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    /* Display */
    return (
      <div
        style={wrapperStyle}
        className={wrapperClasses.value}
        ref={n => { this.$root = n }}>
        {props.blocks?.map(block => {
          const [num, denom] = (block.size ?? '1/1').split('/').map(e => parseFloat(e))
          const imageBlockWidthPercent = 100 * (num ?? 1) / (denom ?? 1)
          const imageBlockStyle: JSX.CSSProperties = {
            '--illus21-chapter-row-this-img-block-percent-width': imageBlockWidthPercent
          }
          return <div
            style={imageBlockStyle}
            className={bem(this.clss).elt('image-block').value}>
            <ImageBlock
              layout={block.layout as 'text-on-left'|'text-under'}
              imageUrl={block.imageUrl}
              legendContent={block.legendContent}
              creditsContent={block.creditsContent}
              readAlsoContent={block.readAlsoContent}
              readAlsoUrl={block.readAlsoUrl} />
          </div>})}
      </div>
    )
  }
}

export type { Props }
export default ChapterRow
