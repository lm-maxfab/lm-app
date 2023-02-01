import { Component, VNode } from 'preact'
import ArticleThumbV2 from '../ArticleThumbV2'
import styles from './styles.module.scss'

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

  render() {
    const { props } = this

    // Assign classes and styles
    const wrapperClasses = [styles['wrapper'], props.customClass]

    const wrapperStyle = `background-color: ${props.bgColor ?? 'transparent'};`

    const displayShade = props.shadeFromColor || props.shadeFromPos || props.shadeToColor || props.shadeToPos

    const shadeStyle = `
      background: linear-gradient(
        ${props.shadeFromColor ?? 'transparent'} 
        ${props.shadeFromPos ?? '50%'}, 
        ${props.shadeToColor ?? 'transparent'} 
        ${props.shadeToPos ?? '100%'});
    `
    const backgroundImageStyle = props.bgImageUrl ? `background-image: url(${props.bgImageUrl})` : ''

    const shadeClass = styles['shade']
    const backgroundImageClass = styles['background-image']
    const thumbnailsClass = styles['thumbnails']

    return <div
      className={wrapperClasses.join(' ')}
      style={wrapperStyle}>

      {/* styles */}
      {props.customCss && <style>{props.customCss}</style>}

      {/* bg-image ? */}
      {props.bgImageUrl && <div className={backgroundImageClass} style={backgroundImageStyle}></div>}
      {displayShade && <div className={shadeClass} style={shadeStyle}></div>}

      {/* above */}
      {props.textAbove && <div>{props.textAbove}</div>}

      {/* thumbs */}
      <div className={thumbnailsClass}>
        {props.articleThumbsData?.map((data) => <ArticleThumbV2 {...data}></ArticleThumbV2>)}
      </div>

      {/* below */}
      {props.textBelow && <div>{props.textBelow}</div>}
    </div>
  }
}

export type { Props }
export default Footer
