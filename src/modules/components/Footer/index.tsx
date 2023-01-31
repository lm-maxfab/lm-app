import { Component, VNode } from 'preact'
import ArticleThumbV2 from '../ArticleThumbV2'
import './styles.scss'

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
  static clss: string = 'lm-article-footer'
  clss = Footer.clss

  render() {
    const { props } = this

    // Assign classes and styles
    const wrapperClasses = [this.clss, props.customClass]
    const wrapperStyle = `
      background: linear-gradient(
        ${props.shadeFromColor ?? 'transparent'} 
        ${props.shadeFromPos ?? '50%'}, 
        ${props.shadeToColor ?? 'rgba(0, 0, 0, 0.3)'} 
        ${props.shadeToPos ?? '100%'});
      background-color: ${props.bgColor ?? 'transparent'};
      background-image: ${props.bgImageUrl ? `url(${props.bgImageUrl})` : ''};
      background-size: cover;
      `

    const backgroundClass = `${this.clss}__background`
    const thumbnailsClass = `${this.clss}__thumbnails`

    return <div
      className={wrapperClasses.join(' ')}
      style={wrapperStyle}>
      Footer

      {/* styles */}
      {props.customCss && <style>{props.customCss}</style>}

      <div className={backgroundClass}></div>

      {/* bg-image ? */}
      {/* shade ? */}

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
