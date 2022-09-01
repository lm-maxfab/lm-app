import { Component, JSX } from 'preact'
import ArticleSeriesHighlight from '../../modules/components/ArticleSeriesHighlight'
import BackgroundVideo from '../../modules/components/BackgroundVideo'
import DemoPage from '../../modules/layouts/DemoPage'
import Scrollator, { ScrollatorPageData } from '../../modules/layouts/Scrollator'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import ArticleCard from '../components/ArticleCard'
import { FooterContentData, ArticlesData } from '../types'
import './styles.scss'

interface Props extends InjectedProps {}

class Footer extends Component<Props, {}> {
  static clss: string = 'sable-footer'
  clss = Footer.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this
    const { sheetBase } = props

    const footerContentData = sheetBase?.collection('footer-content').entries[0].value as unknown as FooterContentData
    const articlesData = sheetBase?.collection('articles-data').value as unknown as ArticlesData[]

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      {/* <DemoPage /> */}
      <ArticleSeriesHighlight
        title={<img src={footerContentData.marqueur_url} />}
        paragraph={footerContentData.paragraph}
        thumbsData={[]} />
      <div style={{ backgroundColor: 'black' }}>
        <Scrollator
          thresholdOffset='70%'
          fixedBlocksPanelHeight='100vh'
          pagesData={articlesData.map(articleData => {
            const ret: ScrollatorPageData = {
              background_block_content: <div
                className={bem(this.clss).elt('fixed-video').value}>
                <BackgroundVideo
                  height='100%'
                  sourceUrl={articleData.bg_video_url}
                  fallbackUrl={articleData.bg_image_url} />
              </div>,

              text_block_content: <div
                className={bem(this.clss).elt('article-slide').value}>
                <ArticleCard
                  overhead={`Épisode ${articleData.episode_number}`}
                  title={articleData.title}
                  buttonText='Lire'
                  activeButtons={articleData.published}
                  inactiveButtonText={`À lire le ${articleData.displayed_publication_date}`}
                  buttonTargetUrl={articleData.url} />
              </div>,

              text_block_position: 'center'
            }
            return ret
          })} />
      </div>
    </div>
  }
}

export type { Props, Footer }
export default appWrapper(Footer)