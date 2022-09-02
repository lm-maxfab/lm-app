import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import './styles.scss'
import Scrollator, { ScrollatorPageData } from '../../modules/layouts/Scrollator'
// import P5Thing from '../components/P5Thing'
import { ArticlesData, CreditsData } from '../types'
import BackgroundVideo from '../../modules/components/BackgroundVideo'
import ArticleHeader from '../../modules/components/ArticleHeader'
import chooseVideoSource from '../utils/choose-video-source'

type ScrollatorPageWithSandControls = ScrollatorPageData & {
  sand_flow?: number
  sand_aperture?: number
  sand_on?: boolean
}

interface Props extends InjectedProps {}

interface State {
  flow: number
  aperture: number
  activateSand: boolean
}

class Longform extends Component<Props, State> {
  static clss: string = 'sable-longform'
  clss = Longform.clss
  state: State = {
    flow: 100,
    aperture: 3,
    activateSand: false
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props, state } = this
    const introPagesData = props.sheetBase?.collection('longform-pages').value as unknown as ScrollatorPageWithSandControls[]
    const articlesData = props.sheetBase?.collection('articles-data').value as unknown as ArticlesData[]
    const articlesDataAsPageData: ScrollatorPageData[] = articlesData.map(articleData => {
      const videoSource = chooseVideoSource({
        '1080': articleData.bg_video_1080_url ?? '',
        '720': articleData.bg_video_720_url ?? '',
        '540': articleData.bg_video_540_url ?? '',
        '360': articleData.bg_video_360_url ?? '',
        '240': articleData.bg_video_240_url ?? ''
      })
      return {
        background_block_color: 'black',
        background_block_content: <div style={{ height: '100vh', width: '100%', padding: '100px' }}>
          <BackgroundVideo
            sourceUrl={videoSource}
            fallbackUrl={articleData.bg_image_url}
            height='100%' />
        </div>,
        text_block_content: <>{articleData.kicker}</>,
        text_block_margin_top: '60vh',
        text_block_margin_bottom: '20vh',
        text_block_position: 'center',
        text_block_text_align: 'center',
        text_block_classes: 'sand-chapter-title'
      }
    })
    const creditsData = props.sheetBase?.collection('credits-content').entries[0].value as unknown as CreditsData
    const creditsDataAsPageData: ScrollatorPageData = {
      background_block_color: 'black',
      background_block_content: <div style={{ height: '100vh', width: '100%', display: 'block' }} />,
      text_block_content: <>{creditsData.content}</>,
      text_block_margin_top: '100vh',
      text_block_margin_bottom: '50vh',
      text_block_position: 'center',
      text_block_text_align: 'left',
      text_block_classes: 'credits'
    }

    const longformPagesData: ScrollatorPageWithSandControls[] = [
      ...introPagesData,
      ...articlesDataAsPageData,
      creditsDataAsPageData
    ]

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      <div style={{ zIndex: 2, position: 'fixed', margin: 8, padding: 0, backgroundColor: 'rgb(0, 0, 0, .9)', top: 0, left: 0 }}><ArticleHeader
        fill1='rgb(255, 255, 255, 1)'
        fill2='rgb(255, 255, 255, .3)' /></div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Scrollator
          onPageChange={(state) => {
            const value = state.value as ScrollatorPageWithSandControls
            this.setState({
              flow: value.sand_flow ?? 100,
              aperture: value.sand_aperture ?? 1,
              activateSand: value.sand_on ?? false
            })
          }}
          _dirtyIntermediateLayer={
            state.activateSand
              ? <div style={{ opacity: 1 }}>
              </div>
              : undefined
          }
          thresholdOffset='10%'
          fixedBlocksPanelHeight='100vh'
          animationDuration={800}
          pagesData={longformPagesData} />
      </div>
    </div>
  }
}

export type { Props, Longform }
export default appWrapper(Longform)
