import { Component, JSX } from 'preact'
import wrapper, { InjectedProps } from '../../wrapper'
import bem from '../../modules/le-monde/utils/bem'
import './styles.scss'
import Paginator from '../../modules/le-monde/components/Paginator'
import LMHeader from '../../modules/le-monde/components/LMHeader'
import ImageFlipper from '../components/ImageFlipper'
import Chapter, { ChapterData } from '../components/Chapter'
import Intro from '../components/Intro'
import Title from '../components/Title'
import { IntroData, IntroImageData } from '../types'

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


    // Logic
    const showImageFlipper = ['init', 'intro', 'title'].includes(currentPageValue)
    const introIsActive = ['init', 'intro'].includes(currentPageValue)
    const titleIsActive = ['title'].includes(currentPageValue)
    const consolidatedChaptersData: ChapterData[] = chaptersData.map(chapter => {
      console.log(chapter)
      const imageFlowData = [{
        slotHeight: chapter.image_1_slot_height,
        width: chapter.image_1_width,
        height: chapter.image_1_height,
        hPos: chapter.image_1_h_pos,
        vPos: chapter.image_1_v_pos,
        url: chapter.image_1_url
      }, {
        slotHeight: chapter.image_2_slot_height,
        width: chapter.image_2_width,
        height: chapter.image_2_height,
        hPos: chapter.image_2_h_pos,
        vPos: chapter.image_2_v_pos,
        url: chapter.image_2_url
      }, {
        slotHeight: chapter.image_3_slot_height,
        width: chapter.image_3_width,
        height: chapter.image_3_height,
        hPos: chapter.image_3_h_pos,
        vPos: chapter.image_3_v_pos,
        url: chapter.image_3_url
      }]
      const contentWithImages = (chapter.content ?? '')
        .replace('[[1]]', typeof imageFlowData[0].url === 'string' && imageFlowData[0].url !== '' ? `<img src="${imageFlowData[0].url}" />` : '')
        .replace('[[2]]', typeof imageFlowData[1].url === 'string' && imageFlowData[1].url !== '' ? `<img src="${imageFlowData[1].url}" />` : '')
        .replace('[[3]]', typeof imageFlowData[2].url === 'string' && imageFlowData[2].url !== '' ? `<img src="${imageFlowData[2].url}" />` : '')
      return {
        ...chapter,
        supertitle: chapter.supertitle,
        kicker: chapter.kicker,
        intro: chapter.intro,
        credits: chapter.credits,
        content: chapter.content,
        main_photo_url: chapter.main_photo_url,
        content_with_images: contentWithImages,
        image_flow_data: imageFlowData
      }
    })

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
        <LMHeader
          fill1={['init', 'intro', 'title'].includes(currentPageValue) ? undefined : 'rgb(27, 23, 27)'}
          fill2={['init', 'intro', 'title'].includes(currentPageValue) ? undefined : 'rgb(27, 23, 27, .6)'}
          fillTransitionTime='200ms' />
      </div>

      {/* Image flipper */}
      <div
        style={{ opacity: showImageFlipper ? 1 : 0  }}
        className={bem(this.clss).elt('image-flipper-slot').value}>
        <ImageFlipper images={introImagesData} />
      </div>

      <Paginator
        onPageChange={this.handlePageChange}>

        {/* Intro */}
        <Paginator.Page value='intro'>
          <div className={bem(this.clss).elt('intro-slot').value}>
            <Intro
              content={introData.paragraph}
              isActive={introIsActive} />
          </div>
        </Paginator.Page>

        {/* Title */}
        <Paginator.Page value='title'>
          <div className={bem(this.clss).elt('title-slot').value}>
            <Title
              content={introData.title}
              isActive={titleIsActive} />
          </div>
        </Paginator.Page>

        {/* Chapters */}
        <Paginator.Page value='chapters'>
          <div className={bem(this.clss).elt('chapters-slot').value}>
            {consolidatedChaptersData.map(chapter => <div className={bem(this.clss).elt('chapter-slot').value}>
              <Chapter data={chapter} />
            </div>)}
          </div>
        </Paginator.Page>

        {/* Credits */}
        <Paginator.Page value='credits'>
          <div className={bem(this.clss).elt('credits-slot').value}>
            Credits
          </div>
        </Paginator.Page>
      </Paginator>
    </div>
  }
}

export type { Props, Longform }
export default wrapper(Longform)
