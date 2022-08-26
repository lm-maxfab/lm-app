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

// bgImageUrl
// title
// articleUrl
// openNewTab
// filterColor
// filterColorHover


// background_block_color?: string
// background_block_content?: VNode|string
// text_block_content?: VNode
// text_block_margin_top?: string
// text_block_margin_bottom?: string
// text_block_position?: string
// text_block_text_align?: string
// text_block_classes?: string




// episode_number
// title
// published
// url
// bg_image_url
// bg_video_url

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

    console.log(articlesData)

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
              background_block_content: <div style={{
                padding: '20px',
                width: '100%',
                height: '100vh'
                }}>
                <BackgroundVideo
                  height='100%'
                  sourceUrl={articleData.bg_video_url}
                  fallbackUrl={articleData.bg_image_url} />
              </div>,

              text_block_content: <div
                style={{
                  backgroundColor: 'red',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: '30vh'
                }}>
                <ArticleCard
                  overhead={`Épisode ${articleData.episode_number}`}
                  title={articleData.title}
                  buttonText='lire' />
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
