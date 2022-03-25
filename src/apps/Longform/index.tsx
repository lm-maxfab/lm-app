import { Component, JSX, VNode } from 'preact'
import Paginator, { State as PaginatorState } from '../../modules/components/Paginator'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import { ChapterData, CreditsData, HeadData, IntroData, SummaryData, FurtherReadingData } from '../types'
import './styles.scss'

import Slide from '../components/Slide'
import TitleCard from '../components/TitleCard'
import TextCard from '../components/TextCard'
import SummaryCard from '../components/SummaryCard'
import FurtherReadingCard from '../components/FurtherReadingCard'
import ArticleCredits from '../../modules/components/ArticleCredits'
import ImageFader from '../components/ImageFader'

interface Props extends InjectedProps {}
interface State {
  currentBgImageUrl: string|null
}

class Longform extends Component<Props, State> {
  static clss: string = 'carto-twitter-longform'
  clss = Longform.clss
  state: State = {
    currentBgImageUrl: null
  }

  constructor (props: Props) {
    super(props)
    this.handlePageChange = this.handlePageChange.bind(this)
  }

  /* * * * * * * * * * * * * * *
   * METHODS
   * * * * * * * * * * * * * * */
  handlePageChange (paginatorState?: PaginatorState): void {
    this.setState({ currentBgImageUrl: (paginatorState?.value?.imageUrl as string|undefined) ?? null })
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props, state } = this

    // Pull data out
    const headData = props.sheetBase?.collection('head')?.entries[0].value as unknown as HeadData|undefined
    const introData = props.sheetBase?.collection('intro')?.value as unknown as IntroData[]|undefined
    const chaptersData = props.sheetBase?.collection('chapters')?.value as unknown as ChapterData[]|undefined
    const summaryData = props.sheetBase?.collection('summary')?.value as unknown as SummaryData[]|undefined
    const furtherReadingData = props.sheetBase?.collection('further_reading')?.value as unknown as FurtherReadingData[]|undefined
    const creditsData = props.sheetBase?.collection('credits')?.entries[0].value as unknown as CreditsData|undefined

    // Logic
    const allImages = [
      headData?.background_image_url,
      ...(introData?.map(introItem => introItem.background_image_url) ?? []),
      ...(chaptersData?.map(chapterData => chapterData.background_image_url) ?? []),
      creditsData?.background_image_url
    ]

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      <div className={bem(this.clss).elt('bg-image').value}>
        <ImageFader
          list={allImages.filter(e => e !== undefined) as string[]}
          current={state.currentBgImageUrl ?? undefined} />
      </div>
      <div className={bem(this.clss).elt('flow').value}>
        <Paginator
          root='window'
          direction='vertical'
          thresholdOffset='75%'
          onPageChange={this.handlePageChange}>
          
          {/* HEAD */}
          <Paginator.Page value={{
            section: 'head',
            imageUrl: headData?.background_image_url
          }}>
            <Slide height='calc(100 * var(--vh))'>
              <TitleCard
                overhead={headData?.overhead}
                title={headData?.title} />
            </Slide>
          </Paginator.Page>
          
          {/* INTRO */}
          {introData?.map(introItem => {
            return <Paginator.Page value={{
              section: 'intro',
              imageUrl: introItem.background_image_url
            }}>
              <Slide height='calc(120 * var(--vh))'>
                <TextCard 
                  paragraph={introItem.paragraph} />
              </Slide>
            </Paginator.Page>
          })}

          {/* CHAPTERS */}
          {chaptersData?.map(chapterItem => {
            return <Paginator.Page value={{
              section: 'chapters',
              imageUrl: chapterItem.background_image_url
            }}>
              <Slide height='calc(120 * var(--vh))'>
                <TextCard
                  paragraph={chapterItem.paragraph}
                  readAlsoTitle={chapterItem.read_also_incentive}
                  readAlsoText={chapterItem.read_also_text}
                  readAlsoUrl={chapterItem.read_also_url} />
              </Slide>
            </Paginator.Page>
          })}

          {/* SUMMARY */}
          {summaryData?.map(summaryItem => {
            const summaryLinks: Array<{ text?: VNode|string, url?: string }> = []
            if (summaryItem.link_1_url !== undefined) summaryLinks.push({ text: summaryItem.link_1_text ?? summaryItem.link_1_url, url: summaryItem.link_1_url })
            if (summaryItem.link_2_url !== undefined) summaryLinks.push({ text: summaryItem.link_2_text ?? summaryItem.link_2_url, url: summaryItem.link_2_url })
            if (summaryItem.link_3_url !== undefined) summaryLinks.push({ text: summaryItem.link_3_text ?? summaryItem.link_3_url, url: summaryItem.link_3_url })
            if (summaryItem.link_4_url !== undefined) summaryLinks.push({ text: summaryItem.link_4_text ?? summaryItem.link_4_url, url: summaryItem.link_4_url })
            if (summaryItem.link_5_url !== undefined) summaryLinks.push({ text: summaryItem.link_5_text ?? summaryItem.link_5_url, url: summaryItem.link_5_url })

            return <Paginator.Page value={{
              section: 'summary',
              imageUrl: summaryItem.background_image_url
            }}>
              <Slide height='calc(120 * var(--vh))'>
                <SummaryCard
                  title={summaryItem.title}
                  links={summaryLinks} />
              </Slide>
            </Paginator.Page>
          })}

          {/* FURTHER READING */}
          {furtherReadingData?.map(furtherReadingItem => {

            return <Paginator.Page value={{
              section: 'further-reading',
              imageUrl: furtherReadingItem.background_image_url
            }}>
              <Slide height='calc(120 * var(--vh))'>
                <FurtherReadingCard 
                  title={furtherReadingItem.title}
                  paragraph={furtherReadingItem.paragraph} />
              </Slide>
            </Paginator.Page>
          })}

          {/* CREDITS */}
          <Paginator.Page value={{
            section: 'credits',
            imageUrl: creditsData?.background_image_url
          }}>
            <Slide height='calc(120 * var(--vh))'>
              <ArticleCredits content={creditsData?.content} />
            </Slide>
          </Paginator.Page>
        </Paginator>
      </div>
    </div>
  }
}

export type { Props, Longform }
export default appWrapper(Longform)
