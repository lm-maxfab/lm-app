import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import './styles.scss'
import Scrollator, { ScrollatorPageData } from '../../modules/layouts/Scrollator'
import getPageId from '../../modules/utils/get-page-id'
import { ArticlesData } from '../types'
import chooseVideoSource from '../utils/choose-video-source'
import BackgroundVideo from '../../modules/components/BackgroundVideo'

type TargetedScrollatorPageData = ScrollatorPageData & { target_article_id: string }

interface Props extends InjectedProps {}

class Header extends Component<Props, {}> {
  static clss: string = 'sable-header'
  clss = Header.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    
    const { props } = this
    const allHeaderPagesData = props.sheetBase?.collection('article-cover-pages').value as unknown as TargetedScrollatorPageData[]
    const currentArticleId = getPageId()
    const headerPagesData = allHeaderPagesData.filter(pageData => pageData.target_article_id === currentArticleId)
    const articlesData = props.sheetBase?.collection('articles-data').value as unknown as ArticlesData[]
    const thisArticleData = articlesData.find(articleData => articleData.target_article_id === currentArticleId)
    const theVideo = chooseVideoSource({
      '1080': thisArticleData?.bg_video_1080_url ?? '',
      '720': thisArticleData?.bg_video_720_url ?? '',
      '540': thisArticleData?.bg_video_540_url ?? '',
      '360': thisArticleData?.bg_video_360_url ?? '',
      '240': thisArticleData?.bg_video_240_url ?? ''
    })

    const trickedHeaderPagesData = headerPagesData.map(pageData => {
      console.log(pageData)
      return {
        ...pageData,
        background_block_color: pageData.background_block_color,
        // background_block_content: pageData.background_block_content,
        text_block_content: pageData.text_block_content,
        text_block_margin_top: pageData.text_block_margin_top,
        text_block_margin_bottom: pageData.text_block_margin_bottom,
        text_block_position: pageData.text_block_position,
        text_block_text_align: pageData.text_block_text_align,
        text_block_classes: pageData.text_block_classes,
        background_block_content: <div style={{ width: '100%', height: '100vh' }}>
          <BackgroundVideo
            play
            height='100%'
            sourceUrl={theVideo}
            fallbackUrl={thisArticleData?.bg_image_url} />
        </div>
      }
    })

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      <Scrollator
        fixedBlocksPanelHeight='100vh'
        pagesData={trickedHeaderPagesData} />
    </div>
  }
}

export type { Props, Header }
export default appWrapper(Header)
