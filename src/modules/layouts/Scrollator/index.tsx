import { Component, VNode, JSX } from 'preact'
import ArticleCredits from '../../components/ArticleCredits'
import BlocksFader from '../../components/BlocksFader'
import ImageFader from '../../components/ImageFader'
import Paginator from '../../components/Paginator'
import bem from '../../utils/bem'
import Slide from './Slide'
import './styles.scss'

export interface ScrollatorPageData {
  mobile_image_url?: string
  desktop_image_url?: string

  background_block_content?: VNode|string
  background_block_style_variants?: string
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
  pagesData: ScrollatorPageData[]
  creditsData: ScrollatorCreditsData
  styleVariantsData: ScrollatorStyleVariantData[]
}

export interface State {
  currentPageData?: ScrollatorPageData
}

export default class Scrollator extends Component<Props, State> {
  static clss: string = 'lm-layout-scrollator'
  clss = Scrollator.clss

  constructor (props: Props) {
    super(props)
    this.pageChangeHandler = this.pageChangeHandler.bind(this)
  }

  pageChangeHandler (value: any) {
    this.setState({ currentPageData: value })
  }

  render () {
    const { props, state } = this
    const { currentPageData: currPage } = state

    // Logic
    const currentBlock = {
      content: currPage?.background_block_content,
      style_variants: currPage?.background_block_style_variants
    }

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      <div className={bem(this.clss).elt('fixed-blocks-slot').value}>
        {/* <ImageFader
          preload={imagesToPreload}
          current={currentImage} /> */}
        <BlocksFader
          current={currentBlock}
          blocks={
            props.pagesData.map(pageData => ({
              content: pageData.background_block_content,
              style_variants: pageData.background_block_style_variants
            }))
          } />
      </div>
      <div className={bem(this.clss).elt('content-slot').value}>
        <Paginator
          root='window'
          direction='vertical'
          thresholdOffset='80%'
          delay={50}
          onPageChange={this.pageChangeHandler}>
          {props.pagesData.map(pageData => (
            <Paginator.Page value={pageData}>
              <Slide
                pageData={pageData}
                styleVariantsData={props.styleVariantsData} />
            </Paginator.Page>
          ))}
        </Paginator>
      </div>
      <div className={bem(this.clss).elt('credits-slot').value}>
        <ArticleCredits content={props.creditsData.content} />
      </div>
    </div>
  }
}
