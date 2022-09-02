import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import './styles.scss'
import Scrollator, { ScrollatorPageData } from '../../modules/layouts/Scrollator'
import P5Thing from '../components/P5Thing'
import { ArticlesData, CreditsData } from '../types'
import BackgroundVideo from '../../modules/components/BackgroundVideo'
import ArticleHeader from '../../modules/components/ArticleHeader'
import chooseVideoSource from '../utils/choose-video-source'
import ArticleCard from '../components/ArticleCard'

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
  currentVideo: number|undefined
  logoMode: 'dark'|'light'
}

class Longform extends Component<Props, State> {
  static clss: string = 'sable-longform'
  clss = Longform.clss
  state: State = {
    flow: 100,
    aperture: 3,
    activateSand: false,
    currentVideo: undefined,
    logoMode: 'light'
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props, state } = this
    const introPagesData = props.sheetBase?.collection('longform-pages').value as unknown as ScrollatorPageWithSandControls[]
    const articlesData = props.sheetBase?.collection('articles-data').value as unknown as ArticlesData[]
    const articlesDataAsPageData: ScrollatorPageData[] = articlesData.map((articleData, articlePos) => {
      const videoSource = chooseVideoSource({
        '1080': articleData.bg_video_1080_url ?? '',
        '720': articleData.bg_video_720_url ?? '',
        '540': articleData.bg_video_540_url ?? '',
        '360': articleData.bg_video_360_url ?? '',
        '240': articleData.bg_video_240_url ?? ''
      })
      return {
        logoMode: 'dark',
        pos: articlePos,
        background_block_color: 'black',
        background_block_content: <div style={{ height: '100vh', width: '100%', padding: '5vw' }}>
          <BackgroundVideo
            sourceUrl={videoSource}
            fallbackUrl={articleData.bg_image_url}
            height='100%' />
        </div>,
        text_block_content: <ArticleCard
          overhead={`Épisode ${articleData.episode_number}`}
          title={articleData.title}
          kicker={articleData.kicker}
          buttonText='Lire'
          activeButtons={articleData.published}
          inactiveButtonText={`${articleData.displayed_publication_date}`}
          buttonTargetUrl={articleData.url} />,// <>{articleData.kicker}</>,
        text_block_margin_top: '60vh',
        text_block_margin_bottom: '20vh',
        text_block_position: 'center',
        text_block_text_align: 'center',
        text_block_classes: 'sand-chapter-title'
      }
    })
    const creditsData = props.sheetBase?.collection('credits-content').entries[0].value as unknown as CreditsData
    const creditsDataAsPageData = {
      logoMode: 'dark',
      background_block_color: 'black',
      background_block_content: <div style={{ height: '100vh', width: '100%', display: 'block', backgroundColor: 'black' }} />,
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
      <div style={{ zIndex: 2, position: 'fixed', margin: 8, padding: 0, backgroundColor: 'rgb(255, 255, 255, 0)', top: 0, left: 0 }}><ArticleHeader
        fill1={state.logoMode === 'dark' ? 'rgb(255, 255, 255, 1)' : 'rgb(0, 0, 0, 1)'}
        fill2={state.logoMode === 'dark' ? 'rgb(255, 255, 255, .3)' : 'rgb(0, 0, 0, .3)'} /></div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Scrollator
          onPageChange={(state) => {
            const value = state.value as ScrollatorPageWithSandControls
            this.setState({
              flow: value.sand_flow ?? 100,
              aperture: value.sand_aperture ?? 1,
              activateSand: value.sand_on ?? false,
              currentVideo: (value as any).pos,
              logoMode: (value as any).logoMode ?? 'light'
            })
          }}
          _dirtyIntermediateLayer={
            state.activateSand
              ? <div style={{ opacity: 1 }}><P5Thing
                height='100vh'
                flow={state.flow}
                aperture={state.aperture}
                frameRate={60}
                maxSimultaneousGrains={10 * 1000}
                gravity={.05}
                showStats={false} />
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
