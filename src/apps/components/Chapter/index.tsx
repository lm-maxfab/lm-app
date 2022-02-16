import { Component, JSX, VNode } from 'preact'
import ImageFlow, { Image as ImageFlowImageData } from '../../../modules/le-monde/components/ImageFlow'
import Img from '../../../modules/le-monde/components/Img'
import StrToHtml from '../../../modules/le-monde/components/StrToHtml'
import bem from '../../../modules/le-monde/utils/bem'

import './styles.scss'

interface ChapterData {
  supertitle?: VNode
  kicker?: VNode
  intro?: VNode
  credits?: VNode
  content?: string
  main_photo_url?: string
  image_flow_data?: ImageFlowImageData[]
  content_with_images?: string

  image_1_slot_height?: string
  image_1_width?: string
  image_1_height?: string
  image_1_h_pos?: string
  image_1_v_pos?: string
  image_1_url?: string
  image_2_slot_height?: string
  image_2_width?: string
  image_2_height?: string
  image_2_h_pos?: string
  image_2_v_pos?: string
  image_2_url?: string
  image_3_slot_height?: string
  image_3_width?: string
  image_3_height?: string
  image_3_h_pos?: string
  image_3_v_pos?: string
  image_3_url?: string
}

interface Props {
  className?: string
  style?: JSX.CSSProperties
  data?: ChapterData
}

class Chapter extends Component<Props, {}> {
  static clss = 'covid-chapter'
  clss = Chapter.clss

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
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
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Classes and style */
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    /* Display */
    return (
      <div className={wrapperClasses.value} style={wrapperStyle}>
        <div className={bem(this.clss).elt('images').value}>
          <Img
            srcset={`
              ${this.getRealImageUrl(props.data?.main_photo_url ?? '', 1400)} 1400w,
              ${this.getRealImageUrl(props.data?.main_photo_url ?? '', 900)} 900w,
              ${this.getRealImageUrl(props.data?.main_photo_url ?? '', 600)} 600w
            `}
            sizes={`
              (max-width: 1024px) 50vw,
              100vw
            `}
            src={props.data?.main_photo_url}
            className={bem(this.clss).elt('main-image').value} />
          <ImageFlow
            images={props.data?.image_flow_data?.map(data => ({
              ...data,
              url: this.getRealImageUrl(data.url ?? '', 900)
            }))}
            className={bem(this.clss).elt('image-flow').value} />
        </div>
        <div className={bem(this.clss).elt('content').value}>
          <div className={bem(this.clss).elt('inner-content').value}>
            <div className={bem(this.clss).elt('supertitle').value}>{props.data?.supertitle}</div>
            <div className={bem(this.clss).elt('supertitle-separator').value} />
            <div className={bem(this.clss).elt('kicker').value}>{props.data?.kicker}</div>
            <div className={bem(this.clss).elt('kicker-separator').value} />
            <Img
              srcset={`
                ${this.getRealImageUrl(props.data?.main_photo_url ?? '', 1400)} 1400w,
                ${this.getRealImageUrl(props.data?.main_photo_url ?? '', 900)} 900w,
                ${this.getRealImageUrl(props.data?.main_photo_url ?? '', 600)} 600w
              `}
              sizes={`
                (max-width: 1024px) 50vw,
                100vw
              `}
              src={this.getRealImageUrl(props.data?.main_photo_url ?? '', 1400)}
              className={bem(this.clss).elt('main-image').value} />
            <div className={bem(this.clss).elt('credits').value}>{props.data?.credits}</div>
            <div className={bem(this.clss).elt('intro').value}>{props.data?.intro}</div>
            <div className={bem(this.clss).elt('intro-separator').value} />
            <div className={bem(this.clss).elt('article-content').value}>
              <StrToHtml content={props.data?.content_with_images} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export type { Props, ChapterData }
export default Chapter
