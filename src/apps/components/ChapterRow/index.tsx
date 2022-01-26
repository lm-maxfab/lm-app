import { Component, JSX } from 'preact'
import Svg from '../../../modules/le-monde/components/Svg'
import bem from '../../../modules/le-monde/utils/bem'
import GroupDelay from '../../../modules/le-monde/utils/group-delay'
import { ImageBlockData } from '../../types'
import ImageBlock from '../ImageBlock'
import chevronSvgUrl from './chevron.svg'

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
  $scroller: HTMLDivElement|null = null
  state: State = {
    isScrolled: false
  }

  /* * * * * * * * * * * * * * *
   * LIFECYCLE
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
    this.horizontalScrollListener = this.horizontalScrollListener.bind(this)
    this.requestInternalScrollListen = this.requestInternalScrollListen.bind(this)
    this.internalScrollListen = this.internalScrollListen.bind(this)
  }

  componentDidMount () {
    if (this.$scroller !== null) {
      this.$scroller.onscroll = this.horizontalScrollListener
    }
  }

  componentWillMount () {
    if (this.$scroller !== null) {
      this.$scroller.onscroll = null
    }
  }

  /* * * * * * * * * * * * * * *
   * METHODS
   * * * * * * * * * * * * * * */
  horizontalScrollListener (event: Event) {
    this.requestInternalScrollListen()
  }

  requestInternalScrollListen = new GroupDelay(this.internalScrollListen.bind(this), 20).call

  internalScrollListen () {
    if (this.$scroller === null) return

    const scrolledLeft = this.$scroller.scrollLeft
    if (this.state.isScrolled && scrolledLeft < 100) this.setState({ isScrolled: false })
    else if (!this.state.isScrolled && scrolledLeft >= 100) this.setState({ isScrolled: true })

    const scrollerWidth = this.$scroller.getBoundingClientRect().width
    
    const $scrollerChildren = [...this.$scroller.children]
    const childrenRects = $scrollerChildren.map(child => child.getBoundingClientRect())
    const xSortedChildrenRects = [...childrenRects].sort((chiA, chiB) => chiA.x - chiB.x)
    const xChildrenLocalRects = xSortedChildrenRects.map(e => {
      const { x, y, width, height, top, left, right, bottom } = e
      const rect = {
        x: x + scrolledLeft,
        left: left + scrolledLeft,
        right: right + scrolledLeft,
        y, top, bottom, width, height
      }
      return rect
    })

    const scrollerInnerWidth = Math.max(...xChildrenLocalRects.map(rect => rect.right))

    console.log('scrolled:', scrolledLeft)
    console.log('inner width:', scrollerInnerWidth)
    console.log('scroller width:', scrollerWidth)
    console.log('max?', scrollerInnerWidth - scrolledLeft === scrollerWidth)
    console.log('==')
    
    // const nearestChildX = xChildrenLocalRects[0]?.x
    // const farthestChildX = xChildrenLocalRects.slice(-1)[0]?.x
    // const farthestChildWidth = xChildrenLocalRects.slice(-1)[0]?.width
    // const childrenRowWidth = (farthestChildX - nearestChildX) + farthestChildWidth

    // const scrollPercent = -1 * nearestChildX
    
    // console.log({
    //   rects: xChildrenLocalRects,
    //   scrollerWidth,
    //   scrollerInnerWidth,
    //   scrollLeft: this.$scroller.scrollLeft,
    // })

    // const childrenMinX = Math.min(...$scrollerChildren.map($child => $child.getBoundingClientRect().x))
    // const childrenMaxX = Math.max(...$scrollerChildren.map($child => $child.getBoundingClientRect().x))
    // const farthestChild = $scrollerChildren.find()

    // ;[...this.$scroller.children].forEach(($child, childPos) => {
    //   console.log(childPos, $child.getBoundingClientRect())
    // })
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
        'is-scrollable': contentWidth > 1
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
        <button className={bem(this.clss).elt('scroll-btn').value}>
          <Svg src={chevronSvgUrl} />
        </button>
        <div
          ref={n => { this.$scroller = n }}
          className={bem(this.clss).elt('inner').value}>{
          props.blocks?.map(block => {
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
            </div>})
        }</div>
      </div>
    )
  }
}

export type { Props }
export default ChapterRow
