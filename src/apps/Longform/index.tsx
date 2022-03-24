import { Component, JSX } from 'preact'
import Paginator, { State as PaginatorState } from '../../modules/components/Paginator'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import { ChapterData, CreditsData, HeadData, IntroData } from '../types'
import './styles.scss'

import Slide from '../components/Slide'
import TitleCard from '../components/TitleCard'
import TextCard from '../components/TextCard'
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
          thresholdOffset='60%'
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

          {/* CREDITS */}
          <Paginator.Page value={{
            section: 'credits',
            imageUrl: creditsData?.background_image_url
          }}>
            <ArticleCredits content={creditsData?.content} />
          </Paginator.Page>
        </Paginator>
      </div>
    </div>
  }
}

export type { Props, Longform }
export default appWrapper(Longform)
