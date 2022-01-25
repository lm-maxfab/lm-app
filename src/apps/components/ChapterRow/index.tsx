import { Component, JSX } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'
import GroupDelay from '../../../modules/le-monde/utils/group-delay'
import { ImageBlockData } from '../../types'
import ImageBlock from '../ImageBlock'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  blocks?: ImageBlockData[]
}

interface State {
  isScrolled: boolean
}

class ChapterRow extends Component<Props, State> {
  static clss = 'illus21-chapter-row'
  clss = ChapterRow.clss
  $root: HTMLDivElement|null = null
  state: State = {
    isScrolled: false
  }

  /* * * * * * * * * * * * * * *
   * LIFECYCLE
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
    this.horizontalScrollListener = this.horizontalScrollListener.bind(this)
    this.requestHorizontalScrollToggle = this.requestHorizontalScrollToggle.bind(this)
    this.horizontalScrollToggle = this.horizontalScrollToggle.bind(this)
  }

  componentDidMount () {
    if (this.$root !== null) {
      this.$root.onscroll = this.horizontalScrollListener
    }
  }

  componentWillMount () {
    if (this.$root !== null) {
      this.$root.onscroll = null
    }
  }

  /* * * * * * * * * * * * * * *
   * METHODS
   * * * * * * * * * * * * * * */
  horizontalScrollListener (event: Event) {
    this.requestHorizontalScrollToggle()
  }

  requestHorizontalScrollToggle = new GroupDelay(this.horizontalScrollToggle.bind(this), 20).call

  horizontalScrollToggle () {
    if (this.$root === null) return
    const scrolled = this.$root.scrollLeft
    if (this.state.isScrolled && scrolled < 100) this.setState({ isScrolled: false })
    else if (!this.state.isScrolled && scrolled >= 100) this.setState({ isScrolled: true })
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props, state } = this

    /* Logic */
    const contentWidth = props.blocks?.reduce((acc: number, block: ImageBlockData) => {
      const [num, denom] = (block.size ?? '1/1').split('/').map(e => parseFloat(e))
      return acc + (num ?? 1) / (denom ?? 1)
    }, 0) ?? 1

    /* Classes and style */
    const wrapperClasses = bem(props.className)
      .block(this.clss)
      .mod({
        'is-scrolled': state.isScrolled,
        'pad-blocks': contentWidth > 1
      })
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style
    }

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
              layout={block.layout}
              imageUrl={block.image_url}
              legendContent={block.legend_content}
              creditsContent={block.credits_content}
              readAlsoContent={block.read_also_content}
              readAlsoUrl={block.read_also_url} />
          </div>})}
      </div>
    )
  }
}

export type { Props }
export default ChapterRow
