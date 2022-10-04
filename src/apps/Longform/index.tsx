import { Component, JSX } from 'preact'
import ArticleCredits from '../../modules/components/ArticleCredits'
import ArticleHeader from '../../modules/components/ArticleHeader'
import ResponsiveDisplayer from '../../modules/components/ResponsiveDisplayer'
import Scrollator, { ScrollatorPageData } from '../../modules/layouts/Scrollator'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import BackgroundSlot from '../components/BackgroundSlot'
import ChapterBlock from '../components/ChapterSlot'
import FrontSlot from '../components/FrontSlot'
import IntroBlock from '../components/IntroBlock'
import { ChapterData, ChapterDataWithLinks, CreditsData, IntroPageData, LinkData } from '../types'
import './styles.scss'

interface Props extends InjectedProps {}
interface State {}

class Longform extends Component<Props, State> {
  static clss: string = 'metoo-longform'
  clss = Longform.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    // Pulling data from Sheetbase
    // const 
    const introPageData = (props.sheetBase?.collection('intro_page').entries[0]?.value ?? {}) as unknown as IntroPageData
    const chaptersData = (props.sheetBase?.collection('chapters').value ?? []) as unknown as ChapterData[]
    const linksData = (props.sheetBase?.collection('links').value ?? []) as unknown as LinkData[]
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
      background_block_color: '',
      text_block_content: <FrontSlot>
        <IntroBlock
          heading={introPageData.heading}
          kicker={introPageData.kicker}
          paragraph={introPageData.paragraph} />
      </FrontSlot>,
      text_block_margin_top: '30vh',
      text_block_margin_bottom: '40vh'
    }

    const chapterPagesProps: ScrollatorPageData[] = chaptersDataWithLinks.map(chapterData => {
      return {
        background_block_content: <BackgroundSlot>
          <ResponsiveDisplayer min={1024}>
            <img
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              src={chapterData.desktop_illustration_url} />
          </ResponsiveDisplayer>
          <ResponsiveDisplayer max={1024}>
            <img
              style={{ height: '30vh', width: '30vh', objectFit: 'cover', margin: '0 auto' }}
              src={chapterData.mobile_illustration_url} />
          </ResponsiveDisplayer>
        </BackgroundSlot>,
        background_block_color: '',
        text_block_content: <FrontSlot>
          <ChapterBlock
            title={chapterData.title}
            paragraph={chapterData.paragraph}
            links={chapterData.links} />
        </FrontSlot>,
        text_block_margin_top: '40vh',
        text_block_margin_bottom: '40vh'
      }
    })

    // const chapterPagesWithPrePageProps: ScrollatorPageData[] = []
    // chapterPagesProps.forEach(chapterPageProps => {
    //   const prePageProps: ScrollatorPageData = {
    //     background_block_content: <BackgroundSlot>
    //       <ResponsiveDisplayer min={1024}>
    //         <img
    //           style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    //           src={chapterPageProps.desktop_illustration_url} />
    //       </ResponsiveDisplayer>
    //       <ResponsiveDisplayer max={1024}>
    //         <img
    //           style={{ height: '30vh', width: '30vh', objectFit: 'cover', margin: '0 auto' }}
    //           src={chapterPageProps.mobile_illustration_url} />
    //       </ResponsiveDisplayer>
    //     </BackgroundSlot>,
    //     background_block_color: '',
    //     text_block_content: <FrontSlot>
    //       <ChapterBlock
    //         title={chapterPageProps.title}
    //         paragraph={chapterPageProps.paragraph}
    //         links={chapterPageProps.links} />
    //     </FrontSlot>,
    //     text_block_margin_top: '0',
    //     text_block_margin_bottom: '40vh'
    //   }
    //   chapterPagesWithPrePageProps.push(prePageProps, chapterPageProps)
    // })

    const creditsPageProps: ScrollatorPageData = {
      background_block_content: <BackgroundSlot>
        <div style={{ height: '100%', width: '100%', backgroundColor: '#0F0225' }}>I am the animation here also?</div>
      </BackgroundSlot>,
      text_block_content: <FrontSlot>
        <ArticleCredits content={creditsData.content} />
      </FrontSlot>,
      text_block_margin_top: '40vh',
      text_block_margin_bottom: '40vh'
    }

    const scrollatorPages: ScrollatorPageData[] = [
      introPageProps,
      ...chapterPagesProps,
      creditsPageProps
    ]
    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

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
          fixedBlocksPanelHeight='100vh'
          pagesData={scrollatorPages} />
      </div>
    </div>
  }
}

export type { Props, Longform }
export default appWrapper(Longform)
