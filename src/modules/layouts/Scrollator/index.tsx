import { Component, VNode, JSX } from 'preact'
import ArticleCredits from '../../components/ArticleCredits'
import BlocksFader from '../../components/BlocksFader'
import Paginator, { State as PaginatorState } from '../../components/Paginator'
import bem from '../../utils/bem'
import Slide from './Slide'
import './styles.scss'

export interface ScrollatorPageData {
  background_block_color?: string
  background_block_content?: VNode|string
  text_block_content?: VNode
  text_block_margin_top?: string
  text_block_margin_bottom?: string
  text_block_position?: string
  text_block_text_align?: string
  text_block_style_variants?: string
}

export interface ScrollatorCreditsData {
  content?: VNode
}

export interface ScrollatorStyleVariantData {
  variant_name?: string
  selector?: string
  max_width?: number
  inline_style?: string
}

export interface Props {
  className?: string
  style?: JSX.CSSProperties
  animationDuration?: number
  pagesData: ScrollatorPageData[]
  creditsData?: ScrollatorCreditsData
  styleVariantsData: ScrollatorStyleVariantData[]
  fixedBlocksPanelHeight: JSX.CSSProperties['height']
  thresholdOffset?: string
}

export interface State {
  currentPageNumber?: number
}

export default class Scrollator extends Component<Props, State> {
  static clss: string = 'lm-layout-scrollator'
  clss = Scrollator.clss

  constructor (props: Props) {
    super(props)
    this.pageChangeHandler = this.pageChangeHandler.bind(this)
  }

  pageChangeHandler (value: number|undefined, paginatorState: PaginatorState|undefined) {
    let activePageValue = value
    if (value === undefined && paginatorState?.direction === 'backwards') { activePageValue = 0 }
    if (value === undefined && paginatorState?.direction === 'forwards') { activePageValue = this.props.pagesData.length - 1 }
    this.setState({ currentPageNumber: activePageValue })
  }

  render () {
    const { props, state } = this
    const { currentPageNumber } = state

    // Logic
    const allBgBlocks = props.pagesData.map(pageData => ({
      content: pageData.background_block_content
    }))

    const allTextBlocks = props.pagesData.map((pageData, pagePos) => (
      <Paginator.Page value={pagePos}>
        <Slide
          pageData={pageData}
          styleVariantsData={props.styleVariantsData} />
      </Paginator.Page>
    ))

    const currentPage = currentPageNumber !== undefined ? props.pagesData[currentPageNumber] : undefined
    const currentPageBgColor = currentPage?.background_block_color

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      '--bg-fade-transition-duration': props.animationDuration !== undefined
        ? `${props.animationDuration}ms`
        : '300ms',
      backgroundColor: currentPageBgColor
    }

    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      <div
        className={bem(this.clss).elt('fixed-blocks-slot').value}
        style={{ height: props.fixedBlocksPanelHeight }}>
        <BlocksFader
          style={{ width: '100%' }}
          current={currentPageNumber}
          blocks={allBgBlocks}
          animationDuration={props.animationDuration ?? 300} />
      </div>
      <div
        className={bem(this.clss).elt('content-slot').value}
        style={{ marginTop: `calc(-1 * ${props.fixedBlocksPanelHeight ?? '0px'})` }}>
        <Paginator
          root='window'
          direction='vertical'
          thresholdOffset={props.thresholdOffset ?? '80%'}
          delay={30}
          onPageChange={this.pageChangeHandler}>
          {allTextBlocks}
        </Paginator>
      </div>
      {props.creditsData && <div className={bem(this.clss).elt('credits-slot').value}>
        <ArticleCredits content={props.creditsData.content} />
      </div>}
    </div>
  }
}
