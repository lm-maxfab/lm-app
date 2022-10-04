import { Component, JSX } from 'preact'
import ArticleCredits from '../../modules/components/ArticleCredits'
import ArticleHeader from '../../modules/components/ArticleHeader'
import ResponsiveDisplayer from '../../modules/components/ResponsiveDisplayer'
import Scrollator, { ScrollatorPageData, ScrollatorPagesState } from '../../modules/layouts/Scrollator'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import BackgroundSlot from '../components/BackgroundSlot'
import ChapterBlock from '../components/ChapterSlot'
import FrontSlot from '../components/FrontSlot'
import IntroBlock from '../components/IntroBlock'
import { ChapterData, ChapterDataWithLinks, CreditsData, IntroPageData, LinkData } from '../types'
import './styles.scss'

interface Props extends InjectedProps {}
interface State {
  bgColor?: string
  mainColor?: string
}

class Longform extends Component<Props, State> {
  static clss: string = 'metoo-longform'
  clss = Longform.clss
  state: State = {
    bgColor: 'white',
    mainColor: 'black'
  }

  constructor (props: Props) {
    super(props)
    this.handlePageChange = this.handlePageChange.bind(this)
  }

  handlePageChange (state: ScrollatorPagesState) {
    if (state.value === undefined) return
    const customData = state.value.custom_data
    if (customData === undefined) return
    const { bgColor, mainColor } = customData
    const newState: State = {}
    if (bgColor !== undefined) newState.bgColor = bgColor
    if (mainColor !== undefined) newState.mainColor = mainColor
    this.setState(curr => ({ ...curr, ...newState }))
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    // Pulling data from Sheetbase
    const introPageData = (props.sheetBase?.collection('intro_page').entries[0]?.value ?? {}) as unknown as IntroPageData
    const chaptersData = (props.sheetBase?.collection('chapters').value ?? []) as unknown as ChapterData[]
    const linksData = ((props.sheetBase?.collection('links').value ?? []) as unknown as LinkData[])
      .filter(linkData => linkData.show_in_longform)
    const chaptersDataWithLinks: ChapterDataWithLinks[] = chaptersData.map(chapterData => {
      const linksStr = chapterData.links_ids
        ?.split(',')
        .filter(e => e)
        .map(e => e.trim())
      const links: LinkData[] = []
      linksData.forEach(linkData => {
        const includeLink = linksStr?.includes(linkData.id)
        if (includeLink) links.push(linkData)
      })
      return { ...chapterData, links }
    })
    const creditsData = (props.sheetBase?.collection('credits').entries[0]?.value ?? {}) as unknown as CreditsData

    // Logic
    const introPageProps: ScrollatorPageData = {
      background_block_content: <BackgroundSlot>
        <div style={{ height: '100%', width: '100%', backgroundColor: '#0F0225' }}>I am the animation here</div>
      </BackgroundSlot>,
      background_block_color: introPageData.background_color,
      text_block_content: <FrontSlot>
        <IntroBlock
          heading={introPageData.heading}
          kicker={introPageData.kicker}
          paragraph={introPageData.paragraph} />
      </FrontSlot>,
      text_block_margin_top: '40vh',
      text_block_margin_bottom: '40vh',
      custom_data: {
        bgColor: introPageData.background_color,
        mainColor: introPageData.main_color
      }
    }

    const chapterPagesProps: ScrollatorPageData[] = []
    chaptersDataWithLinks.forEach(chapterData => {
      const prePageProps: ScrollatorPageData = {
        background_block_color: chapterData.background_color,
        background_block_content: <BackgroundSlot>
          <ResponsiveDisplayer min={1024}>
            <img
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              src={chapterData.desktop_illustration_url} />
          </ResponsiveDisplayer>
          <ResponsiveDisplayer max={1024}>
            <img
              style={{ height: '40vh', width: '40vh', objectFit: 'cover', margin: '0 auto' }}
              src={chapterData.mobile_illustration_url} />
          </ResponsiveDisplayer>
        </BackgroundSlot>,
        text_block_content: <div style={{ height: '20vh' }} />,
        text_block_margin_top: '40vh',
        text_block_margin_bottom: '0vh',
        custom_data: {
          bgColor: chapterData.background_color,
          mainColor: chapterData.main_color
        }
      }
      const actualPageProps: ScrollatorPageData = {
        background_block_color: chapterData.background_color,
        background_block_content: <BackgroundSlot>
          <ResponsiveDisplayer min={1024}>
            <img
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 1 }}
              src={chapterData.desktop_illustration_url} />
          </ResponsiveDisplayer>
          <ResponsiveDisplayer max={1024}>
            <img
              style={{ height: '40vh', width: '40vh', objectFit: 'cover', margin: '0 auto', opacity: .3 }}
              src={chapterData.mobile_illustration_url} />
          </ResponsiveDisplayer>
        </BackgroundSlot>,
        text_block_content: <FrontSlot>
          <ChapterBlock
            title={chapterData.title}
            paragraph={chapterData.paragraph}
            links={chapterData.links}
            mobileImageUrl={chapterData.mobile_illustration_url} />
        </FrontSlot>,
        text_block_margin_top: '0vh',
        text_block_margin_bottom: '40vh',
        custom_data: {
          bgColor: chapterData.background_color,
          mainColor: chapterData.main_color
        }
      }
      chapterPagesProps.push(
        prePageProps,
        actualPageProps
      )
    })

    const creditsPageProps: ScrollatorPageData = {
      background_block_color: creditsData.background_color,
      background_block_content: <BackgroundSlot>
        <div style={{ height: '100%', width: '100%', backgroundColor: '#0F0225' }}>I am the animation here also?</div>
      </BackgroundSlot>,
      text_block_content: <FrontSlot>
        <ArticleCredits content={<div style={{ color: `var(--metoo-c-main-color)` }}>
          {creditsData.content}
        </div>} />
      </FrontSlot>,
      text_block_margin_top: '40vh',
      text_block_margin_bottom: '40vh',
      custom_data: {
        bgColor: creditsData.background_color,
        mainColor: creditsData.main_color
      }
    }

    const scrollatorPages: ScrollatorPageData[] = [
      introPageProps,
      ...chapterPagesProps,
      creditsPageProps
    ]
    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      ['--metoo-c-bg-color']: this.state.bgColor,
      ['--metoo-c-main-color']: this.state.mainColor
    }

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 2 }}>
        <ArticleHeader
          fill1='white'
          fill2='rgb(255, 255, 255, .7)' />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Scrollator
          onPageChange={this.handlePageChange}
          fixedBlocksPanelHeight='100vh'
          thresholdOffset='60%'
          pagesData={scrollatorPages} />
      </div>
    </div>
  }
}

export type { Props, Longform }
export default appWrapper(Longform)
