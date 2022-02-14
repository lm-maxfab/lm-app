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
            src={props.data?.main_photo_url}
            className={bem(this.clss).elt('main-image').value} />
          <ImageFlow
            images={props.data?.image_flow_data}
            className={bem(this.clss).elt('image-flow').value} />
        </div>
        <div className={bem(this.clss).elt('content').value}>
          <div className={bem(this.clss).elt('supertitle').value}>{props.data?.supertitle}</div>
          <div className={bem(this.clss).elt('supertitle-separator').value} />
          <div className={bem(this.clss).elt('kicker').value}>{props.data?.kicker}</div>
          <div className={bem(this.clss).elt('kicker-separator').value} />
          <Img
            src={props.data?.main_photo_url}
            className={bem(this.clss).elt('main-image').value} />
          <div className={bem(this.clss).elt('credits').value}>{props.data?.credits}</div>
          <div className={bem(this.clss).elt('intro').value}>{props.data?.intro}</div>
          <div className={bem(this.clss).elt('intro-separator').value} />
          <div className={bem(this.clss).elt('article-content').value}>
            <StrToHtml content={props.data?.content_with_images} />
          </div>
        </div>
      </div>
    )
  }
}

export type { Props, ChapterData }
export default Chapter
