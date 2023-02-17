import { Component, VNode } from 'preact'
import ArticleThumb, { Props as ArticleThumbProps } from '../ArticleThumb'
import styles from './styles.module.scss'
import bem from '../../utils/bem'
import Svg from '../Svg'
import Img from '../Img'

interface Props {
  customClass?: string
  customCss?: string
  bgColor?: string
  bgImageUrl?: string
  shadeFromPos?: string
  shadeFromColor?: string
  shadeToPos?: string
  shadeToColor?: string
  textAbove?: string|VNode
  articleThumbsData?: ArticleThumbProps[]
  textBelow?: string|VNode
}

class Footer extends Component<Props, {}> {
  bemClss = bem('lm-article-footer')

  render() {
    const { props, bemClss } = this

    // Assign classes and styles
    const wrapperClasses = [props.customClass, bemClss.value, styles['wrapper']]
    const backgroundImageClasses = [bemClss.elt('background-image').value, styles['background-image']]
    const shadeClasses = [bemClss.elt('shade').value, styles['shade']]
    const thumbnailsClasses = [bemClss.elt('thumbnails').value, styles['thumbnails']]
    const aboveClasses = [bemClss.elt('above').value, styles['above']]
    const belowClasses = [bemClss.elt('below').value, styles['below']]
    // [WIP] variable here
    const wrapperStyle = `background-color: ${props.bgColor ?? 'transparent'};`
    const displayShade = (props.shadeFromColor
      ?? props.shadeFromPos
      ?? props.shadeToColor
      ?? props.shadeToPos) !== undefined
    // [WIP] variable here
    const shadeStyle = `
      background: linear-gradient(
        ${props.shadeFromColor ?? 'transparent'} 
        ${props.shadeFromPos ?? '50%'}, 
        ${props.shadeToColor ?? 'transparent'} 
        ${props.shadeToPos ?? '100%'});`

    const bgImageIsSvg = props.bgImageUrl?.endsWith('.svg')

    return <div
      className={wrapperClasses.join(' ')}
      style={wrapperStyle}>

      {/* Styles */}
      {props.customCss && <style>
        {props.customCss}
      </style>}

      {/* Bg image */}
      {props.bgImageUrl && <div
        className={backgroundImageClasses.join(' ')}>
        {bgImageIsSvg
          // [WIP] maybe Img should do this itself,
          // this logic is duplicated in ArticleThumb comp
          // [WIP] no desc/alt here ?
          ? <Svg src={props.bgImageUrl}></Svg>
          : <Img src={props.bgImageUrl}></Img>}
      </div>}

      {/* Shade */}
      {displayShade && <div 
        className={shadeClasses.join(' ')}
        style={shadeStyle} />}

      {/* Above */}
      {props.textAbove && <div
        className={aboveClasses.join(' ')}>
        {props.textAbove}
      </div>}

      {/* Thumbs */}
      <div  
        className={thumbnailsClasses.join(' ')}>
        {props.articleThumbsData?.map(articleThumbProps => (
          <ArticleThumb {...articleThumbProps} />
        ))}
      </div>

      {/* Below */}
      {props.textBelow && <div
        className={belowClasses.join(' ')}>
        {props.textBelow}
      </div>}
    </div>
  }
}

export type { Props }
export default Footer
