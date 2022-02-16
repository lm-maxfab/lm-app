import { Component, JSX } from 'preact'
import wrapper, { InjectedProps } from '../../wrapper'
import bem from '../../modules/le-monde/utils/bem'
import './styles.scss'
import Paginator from '../../modules/le-monde/components/Paginator'
import ArticleHeader from '../../modules/le-monde/components/ArticleHeader'
import ImageFlipper from '../components/ImageFlipper'
import Chapter, { ChapterData } from '../components/Chapter'
import Kicker from '../components/Kicker'
import Intro from '../components/Intro'
import Title from '../components/Title'
import { IntroData, IntroImageData, CreditsData } from '../types'
import ArticleCredits from '../../modules/le-monde/components/ArticleCredits'
import ArrowButton from '../components/ArrowButton'

interface Props extends InjectedProps {}
interface State {
  currentPageValue?: any
}

class Longform extends Component<Props, State> {
  static clss: string = 'covid-longform'
  clss = Longform.clss
  state: State = {
    currentPageValue: 'init'
  }

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.getRealImageUrl = this.getRealImageUrl.bind(this)
  }

  /* * * * * * * * * * * * * * *
   * METHODS
   * * * * * * * * * * * * * * */
  getRealImageUrl (url: string, size: number) {
    return url.replace(
      /[a-z]+$/igm,
      match => `${size}.q65.comp.${match}`
    )
  }

  /* * * * * * * * * * * * * * *
   * METHODS
   * * * * * * * * * * * * * * */
  handlePageChange (value: any) {
    this.setState({ currentPageValue: value })
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props, state } = this
    const { currentPageValue } = state

    // Get data
    const introData = props.sheetBase.collection('intro').entries[0].value as unknown as IntroData
    const introImagesData = props.sheetBase.collection('intro_images').value as unknown as IntroImageData[]
    const chaptersData = props.sheetBase.collection('portraits').value as unknown as ChapterData[]
    const creditsData = props.sheetBase.collection('credits').entries[0].value as unknown as CreditsData

    // Logic
    const showImageFlipper = ['init', 'kicker', 'intro', 'title'].includes(currentPageValue)
    const introIsActive = ['init', 'kicker', 'intro'].includes(currentPageValue)
    const titleIsActive = ['title'].includes(currentPageValue)
    const consolidatedChaptersData: ChapterData[] = chaptersData.map(chapter => {
      const imageFlowData = [{
        slotHeight: chapter.image_1_slot_height,
        width: chapter.image_1_width,
        height: chapter.image_1_height,
        hPos: chapter.image_1_h_pos,
        vPos: chapter.image_1_v_pos,
        url: chapter.image_1_url ?? ''
      }, {
        slotHeight: chapter.image_2_slot_height,
        width: chapter.image_2_width,
        height: chapter.image_2_height,
        hPos: chapter.image_2_h_pos,
        vPos: chapter.image_2_v_pos,
        url: chapter.image_2_url ?? ''
      }, {
        slotHeight: chapter.image_3_slot_height,
        width: chapter.image_3_width,
        height: chapter.image_3_height,
        hPos: chapter.image_3_h_pos,
        vPos: chapter.image_3_v_pos,
        url: chapter.image_3_url ?? ''
      }]
      const { url1, url2, url3 } = {
        url1: imageFlowData[0].url,
        url2: imageFlowData[1].url,
        url3: imageFlowData[2].url
      }
      const contentWithImages = (chapter.content ?? '')
        .replace(
          '[[1]]',
          url1 !== ''
            ? `<img
              srcset="
                ${this.getRealImageUrl(url1 ?? '', 1400)} 1400w,
                ${this.getRealImageUrl(url1 ?? '', 900)} 900w,
                ${this.getRealImageUrl(url1 ?? '', 600)} 600w
              "
              sizes="100vw"
              src="${this.getRealImageUrl(url1 ?? '', 900)}" />`
            : ''
        ).replace(
          '[[2]]',
          url2 !== ''
            ? `<img
              srcset="
                ${this.getRealImageUrl(url2 ?? '', 1400)} 1400w,
                ${this.getRealImageUrl(url2 ?? '', 900)} 900w,
                ${this.getRealImageUrl(url2 ?? '', 600)} 600w
              "
              sizes="100vw"
              src="${this.getRealImageUrl(url2 ?? '', 900)}" />`
            : ''
        ).replace(
          '[[3]]',
          url3 !== ''
            ? `<img
              srcset="
                ${this.getRealImageUrl(url3 ?? '', 1400)} 1400w,
                ${this.getRealImageUrl(url3 ?? '', 900)} 900w,
                ${this.getRealImageUrl(url3 ?? '', 600)} 600w
              "
              sizes="100vw"
              src="${this.getRealImageUrl(url3 ?? '', 900)}" />`
            : ''
        )
      return {
        ...chapter,
        supertitle: chapter.supertitle,
        kicker: chapter.kicker,
        intro: chapter.intro,
        credits: chapter.credits,
        content: chapter.content,
        main_photo_url: chapter.main_photo_url,
        content_with_images: contentWithImages,
        image_flow_data: imageFlowData,
        kicker_span_color: chapter.kicker_span_color
      }
    })
    const logoColors = {
      main: ['init', 'kicker', 'intro', 'title'].includes(currentPageValue)
        ? undefined
        : 'rgb(27, 23, 27)',
      shadow: ['init', 'kicker', 'intro', 'title'].includes(currentPageValue)
        ? undefined
        : 'rgb(27, 23, 27, .6)'
    }

    let arrowOpacity = 0
    if (state.currentPageValue === 'init' || state.currentPageValue === 'kicker') arrowOpacity = 1
    else if (state.currentPageValue === 'intro' || state.currentPageValue === 'title') arrowOpacity = .3

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      marginTop: 'var(--len-nav-height)'
    }

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      {/* Header */}
      <div className={bem(this.clss).elt('header-slot').value}>
        <ArticleHeader
          fill1={logoColors.main}
          fill2={logoColors.shadow}
          fillTransitionTime='200ms' />
      </div>

      {/* Image flipper */}
      <div
        style={{
          opacity: showImageFlipper ? 1 : 0,
          zIndex: showImageFlipper ? 2 : 1
        }}
        className={bem(this.clss).elt('image-flipper-slot').value}>
        <ImageFlipper
          opacity={introData.images_opacity}
          images={introImagesData} />
      </div>

      {/* Arrow button */}
      <div
        style={{
          display: ['init', 'kicker', 'intro', 'title'].includes(state.currentPageValue)
            ? 'flex'
            : 'none'
        }}
        className={bem(this.clss).elt('arrow-button-slot').value}>
        <div className={bem(this.clss).elt('arrow-button-inner-slot').value}>
          <ArrowButton style={{ opacity: arrowOpacity }} />
        </div>
      </div>

      <Paginator
        onPageChange={this.handlePageChange}>

        {/* Kicker */}
        <Paginator.Page value='kicker'>
          <div className={bem(this.clss).elt('kicker-slot').value}>
            <div className={bem(this.clss).elt('kicker-slot-inner').value}>
              <Kicker
                content={introData.kicker}
                isActive={introIsActive} />
            </div>
          </div>
        </Paginator.Page>

        {/* Intro */}
        <Paginator.Page value='intro'>
          <div className={bem(this.clss).elt('intro-slot').value}>
            <div className={bem(this.clss).elt('intro-slot-inner').value}>
              <Intro
                content={introData.paragraph}
                isActive={introIsActive} />
            </div>
          </div>
        </Paginator.Page>

        {/* Title */}
        <Paginator.Page value='title'>
          <div className={bem(this.clss).elt('title-slot').value}>
            <div className={bem(this.clss).elt('title-slot-inner').value}>
              <Title
                content={introData.title}
                isActive={titleIsActive} />
            </div>
          </div>
        </Paginator.Page>

        {/* Chapters */}
        <Paginator.Page value='chapters'>
          <div
            style={{
              opacity: showImageFlipper ? 0 : 1,
              zIndex: showImageFlipper ? 1 : 2
            }}
            className={bem(this.clss).elt('chapters-slot').value}>
            {consolidatedChaptersData.map(chapter => {
              return <div className={bem(this.clss).elt('chapter-slot').value}>
                <Chapter data={chapter} />
              </div>
            })}
          </div>
        </Paginator.Page>

        {/* Credits */}
        <Paginator.Page value='credits'>
          <div
            className={bem(this.clss).elt('credits-slot').value}>
            <ArticleCredits content={creditsData.content} />
          </div>
        </Paginator.Page>
      </Paginator>
    </div>
  }
}

export type { Props, Longform }
export default wrapper(Longform)
