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

interface Props extends InjectedProps {}
interface State {
  currentPageValue?: any
}

const chapters: any[] = [{
  supertitle: <>Agata Kubis, 44 ans, Pologne</>,
  kicker: <>« Le Covid et le licenciement m'ont décidé à me consacrer pleinement à l'activisme et à la photographie »</>,
  intro: <>Agata Kubis a 44 ans, elle vit a Varsovie. Employée de banque depuis plus de 20 ans, elle perd son emploi à cause de la crise financière provoquée par le covid. Elle se consacre depuis entièrement à l’activisme, contre les réformes du gouvernement polonais.</>,
  credits: <>Photos par Marie Sumalla</>,
  content: `
  <p>Malgré les angoisses liées à cette rupture, le changement m’a ouvert un nouvel espace. Je travaille depuis longtemps comme photographe indépendante, en dehors de mes heures de bureau.</p>
  [[1]]
  <p>Je documente toutes les manifestations de la société civile contre les réformes du PIS. En effet , la prise de pouvoir en 2015 du parti PiS (Droit et Justice) est un bouleversement, comme l’a été la fin du régime communiste pour ma mère. Il a réveillé la résistance et l'opposition sociale en prenant des mesures contre les femmes, contre la communauté LGBT +, contre la démocratie. Pour moi, il ne s’agit pas pas seulement d’un défi professionnel. C'est aussi un sens du devoir. Je suis une femme, je suis une lesbienne.</p> 
  [[2]]
  <p>Le covid, le licenciement m’ont décidé à me consacrer pleinement à la photographie et à l'activisme, le temps s'ouvre, il apporte du nouveau. Paradoxalement, cela me donne un sentiment de confiance et de pouvoir.»</p>
  [[3]]
  <p>Je documente toutes les manifestations de la société civile contre les réformes du PIS. En effet , la prise de pouvoir en 2015 du parti PiS (Droit et Justice) est un bouleversement, comme l’a été la fin du régime communiste pour ma mère. Il a réveillé la résistance et l'opposition sociale en prenant des mesures contre les femmes, contre la communauté LGBT +, contre la démocratie. Pour moi, il ne s’agit pas pas seulement d’un défi professionnel. C'est aussi un sens du devoir. Je suis une femme, je suis une lesbienne.</p> `,
  main_photo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png',
  image_1_slot_height: '20vw',
  image_1_width: '40%',
  image_1_height: '',
  image_1_h_pos: '0%',
  image_1_v_pos: '50%',
  image_1_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png',
  image_2_slot_height: '20vw',
  image_2_width: '40%',
  image_2_height: '',
  image_2_h_pos: '100%',
  image_2_v_pos: '50%',
  image_2_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png',
  image_3_slot_height: '20vw',
  image_3_width: '50%',
  image_3_height: '',
  image_3_h_pos: '50%',
  image_3_v_pos: '50%',
  image_3_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png'
}, {
  supertitle: <>Agata Kubis, 44 ans, Pologne</>,
  kicker: <>« Le Covid et le licenciement m'ont décidé à me consacrer pleinement à l'activisme et à la photographie »</>,
  intro: <>Agata Kubis a 44 ans, elle vit a Varsovie. Employée de banque depuis plus de 20 ans, elle perd son emploi à cause de la crise financière provoquée par le covid. Elle se consacre depuis entièrement à l’activisme, contre les réformes du gouvernement polonais.</>,
  credits: <>Photos par Marie Sumalla</>,
  content: 'Lorem ipsum dolor sit amet',
  main_photo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png',
  image_1_slot_height: '20vw',
  image_1_width: '50%',
  image_1_height: '',
  image_1_h_pos: '50%',
  image_1_v_pos: '50%',
  image_1_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png',
  image_2_slot_height: '20vw',
  image_2_width: '50%',
  image_2_height: '',
  image_2_h_pos: '50%',
  image_2_v_pos: '50%',
  image_2_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png',
  image_3_slot_height: '20vw',
  image_3_width: '50%',
  image_3_height: '',
  image_3_h_pos: '50%',
  image_3_v_pos: '50%',
  image_3_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png'
}, {
  supertitle: <>Agata Kubis, 44 ans, Pologne</>,
  kicker: <>« Le Covid et le licenciement m'ont décidé à me consacrer pleinement à l'activisme et à la photographie »</>,
  intro: <>Agata Kubis a 44 ans, elle vit a Varsovie. Employée de banque depuis plus de 20 ans, elle perd son emploi à cause de la crise financière provoquée par le covid. Elle se consacre depuis entièrement à l’activisme, contre les réformes du gouvernement polonais.</>,
  credits: <>Photos par Marie Sumalla</>,
  content: 'Lorem ipsum dolor sit amet',
  main_photo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png',
  image_1_slot_height: '20vw',
  image_1_width: '50%',
  image_1_height: '',
  image_1_h_pos: '50%',
  image_1_v_pos: '50%',
  image_1_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png',
  image_2_slot_height: '20vw',
  image_2_width: '50%',
  image_2_height: '',
  image_2_h_pos: '50%',
  image_2_v_pos: '50%',
  image_2_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png',
  image_3_slot_height: '20vw',
  image_3_width: '50%',
  image_3_height: '',
  image_3_h_pos: '50%',
  image_3_v_pos: '50%',
  image_3_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png'
}]

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

    console.log(props.sheetBase.value)

    // Logic
    const showImageFlipper = ['init', 'intro', 'title'].includes(currentPageValue)
    const introIsActive = ['init', 'intro'].includes(currentPageValue)
    const titleIsActive = ['title'].includes(currentPageValue)
    const consolidatedChaptersData: ChapterData[] = chapters.map(chapter => {
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
      const contentWithImages = chapter.content
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
      marginTop: 'var(--len-nav-height)',
      marginBottom: '40000px'
    }

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      {/* Header */}
      <div className={bem(this.clss).elt('header-slot').value}>
        <LMHeader />
      </div>

      {/* Image flipper */}
      <div
        style={{ opacity: showImageFlipper ? 1 : 0  }}
        className={bem(this.clss).elt('image-flipper-slot').value}>
        <ImageFlipper />
      </div>

      <Paginator
        onPageChange={this.handlePageChange}>

        {/* Intro */}
        <Paginator.Page value='intro'>
          <div className={bem(this.clss).elt('intro-slot').value}>
            <Intro isActive={introIsActive} />
          </div>
        </Paginator.Page>

        {/* Title */}
        <Paginator.Page value='title'>
          <div className={bem(this.clss).elt('title-slot').value}>
            <Title isActive={titleIsActive} />
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
