import { Component, VNode } from 'preact'
import ArticleThumbV2 from '../ArticleThumbV2'
import styles from './styles.module.scss'
import bem from '../../utils/bem'
import Svg from '../Svg'
import Img from '../Img'

interface ArticleThumbsProps {
  customClass?: string
  customCss?: string

  imageUrl?: string
  imageAlt?: string

  textAbove?: string | VNode
  textBelow?: string | VNode

  textBeforeTop?: string | VNode
  textBeforeCenter?: string | VNode
  textBeforeBottom?: string | VNode

  textAfterTop?: string | VNode
  textAfterCenter?: string | VNode
  textAfterBottom?: string | VNode

  textInsideTop?: string | VNode
  textInsideCenter?: string | VNode
  textInsideBottom?: string | VNode

  shadeFromPos?: string
  shadeFromColor?: string
  shadeToPos?: string
  shadeToColor?: string

  status?: string
  statusOverrides?: {
    [statusName: string]: Omit<Props, 'status' | 'statusOverrides'>
  }
}

interface Props {
  customClass?: string
  customCss?: string

  bgColor?: string
  bgImageUrl?: string

  shadeFromPos?: string
  shadeFromColor?: string
  shadeToPos?: string
  shadeToColor?: string

  textAbove?: string | VNode
  articleThumbsData?: ArticleThumbsProps[]
  textBelow?: string | VNode
}

class Footer extends Component<Props, {}> {
  bemClss = bem('lm-article-footer')

  render() {
    const { props, bemClss } = this

    // Assign classes and styles
    const wrapperClasses = [
      props.customClass,
      bemClss.value,
      styles['wrapper']
    ]
    const backgroundImageClasses = [
      bemClss.elt('background-image').value,
      styles['background-image']
    ]
    const shadeClasses = [
      bemClss.elt('shade').value,
      styles['shade']
    ]
    const thumbnailsClasses = [
      bemClss.elt('thumbnails').value,
      styles['thumbnails']
    ]
    const aboveClasses = [
      bemClss.elt('above').value,
      styles['above']
    ]
    const belowClasses = [
      bemClss.elt('below').value,
      styles['below']
    ]

    const wrapperStyle = `background-color: ${props.bgColor ?? 'transparent'};`

    const displayShade = props.shadeFromColor || props.shadeFromPos || props.shadeToColor || props.shadeToPos

    const shadeStyle = `
      background: linear-gradient(
        ${props.shadeFromColor ?? 'transparent'} 
        ${props.shadeFromPos ?? '50%'}, 
        ${props.shadeToColor ?? 'transparent'} 
        ${props.shadeToPos ?? '100%'});
    `

    const bgImageIsSvg = props.bgImageUrl?.endsWith('.svg')

    return <div
      className={wrapperClasses.join(' ')}
      style={wrapperStyle}>

      {/* styles */}
      {props.customCss && <style>{props.customCss}</style>}

      {/* bg-image */}
      {props.bgImageUrl && <div className={backgroundImageClasses.join(' ')}>
        {bgImageIsSvg
          ? <Svg src={props.bgImageUrl}></Svg>
          : <Img src={props.bgImageUrl}></Img>}
      </div>}

      {/* shade */}
      {displayShade && <div className={shadeClasses.join(' ')} style={shadeStyle}></div>}

      {/* above */}
      {props.textAbove && <div className={aboveClasses.join(' ')}>{props.textAbove}</div>}

      {/* thumbs */}
      <div className={thumbnailsClasses.join(' ')}>
        {props.articleThumbsData?.map((data) => <ArticleThumbV2 {...data}></ArticleThumbV2>)}
      </div>

      {/* below */}
      {props.textBelow && <div className={belowClasses.join(' ')}>{props.textBelow}</div>}
    </div>
  }
}

export type { Props }
export default Footer
