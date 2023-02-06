import { Component, VNode } from 'preact'
import ArticleThumbnail from '../ArticleThumbnail'
import { Props as ArticleThumbnailProps } from '../ArticleThumbnail'
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

  contentAbove?: string | VNode
  articleThumbsData?: ArticleThumbnailProps[]
  contentBelow?: string | VNode
}

class Footer extends Component<Props, {}> {
  bemClss = bem('lm-article-footer')

  render() {
    const { props, bemClss } = this

    console.log('footer props')
    console.log(props.articleThumbsData)

    props.articleThumbsData?.map((data) => console.log({...data}))

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
      {props.contentAbove && <div className={aboveClasses.join(' ')}>{props.contentAbove}</div>}

      {/* thumbs */}
      <div className={thumbnailsClasses.join(' ')}>
        {props.articleThumbsData?.map((data) => <ArticleThumbnail {...data}></ArticleThumbnail>)}
      </div>

      {/* below */}
      {props.contentBelow && <div className={belowClasses.join(' ')}>{props.contentBelow}</div>}
    </div>
  }
}

export type { Props }
export default Footer
