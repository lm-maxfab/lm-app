import { Component, JSX } from 'preact'
import ArticleSeriesHighlight from '../../modules/components/ArticleSeriesHighlight'
import BackgroundVideo from '../../modules/components/BackgroundVideo'
import Scrollator, { ScrollatorPageData } from '../../modules/layouts/Scrollator'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import ArticleCard from '../components/ArticleCard'
import { FooterContentData, ArticlesData } from '../types'
import chooseVideoSource from '../utils/choose-video-source'
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

    const marqueurSubstitute = footerContentData.marqueur_substitute_text
    const marqueurNode = marqueurSubstitute !== '' && marqueurSubstitute !== undefined
      ? <p className={bem(this.clss).elt('marqueur-substitute').value}>{marqueurSubstitute}</p>
      : <img src={footerContentData.marqueur_url} />
    console.log(marqueurSubstitute)

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      <ArticleSeriesHighlight
        style={{ padding: '32px', paddingBottom: '0px', paddingTop: '64px' }}
        title={marqueurNode}
        paragraph={footerContentData.paragraph}
        thumbsData={[]} />
      <div style={{ backgroundColor: 'black' }}>
        <Scrollator
          thresholdOffset='70%'
          fixedBlocksPanelHeight='100vh'
          pagesData={articlesData.map(articleData => {
            const videoSource = chooseVideoSource([
              { source: articleData.bg_video_1080_url ?? '', height: 1080 },
              { source: articleData.bg_video_720_url ?? '', height: 720 },
              { source: articleData.bg_video_540_url ?? '', height: 540 },
              { source: articleData.bg_video_360_url ?? '', height: 360 },
              { source: articleData.bg_video_240_url ?? '', height: 240 }
            ], {
              downlink: (window.navigator as any)?.connection?.downlink * 0.8 ?? 5
            }) ?? articleData.bg_video_720_url ?? ''
            const ret: ScrollatorPageData = {
              background_block_content: <div
                className={bem(this.clss).elt('fixed-video').value}>
                <BackgroundVideo
                  height='100%'
                  sourceUrl={videoSource}
                  fallbackUrl={articleData.bg_image_url} />
              </div>,

              text_block_content: <div
                className={bem(this.clss).elt('article-slide').value}>
                <ArticleCard
                  overhead={articleData.episode_number}
                  title={articleData.title}
                  kicker={articleData.kicker}
                  buttonText={articleData.read_button_text}
                  activeButtons={articleData.published}
                  inactiveButtonText={articleData.displayed_publication_date}
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
