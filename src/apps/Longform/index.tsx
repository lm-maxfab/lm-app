import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import './styles.scss'
import Scrollator, { ScrollatorPageData } from '../../modules/layouts/Scrollator'
import P5Thing from '../components/P5Thing'
import { ArticlesData, CreditsData } from '../types'
import BackgroundVideo from '../../modules/components/BackgroundVideo'

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
      return {
        background_block_color: 'black',
        background_block_content: <div style={{ height: '100vh', width: '100%', padding: '100px' }}>
          <BackgroundVideo
            sourceUrl={articleData.bg_video_url}
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
      text_block_margin_bottom: '10vh',
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
      <Scrollator
        onPageChange={(state) => {
          const value = state.value as ScrollatorPageWithSandControls
          console.log(state)
          this.setState({
            flow: value.sand_flow ?? 100,
            aperture: value.sand_aperture ?? 1,
            activateSand: value.sand_on ?? false
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
  }
}

export type { Props, Longform }
export default appWrapper(Longform)
