import { Component, VNode } from 'preact'
import Svg from '../Svg'
import Img from '../Img'
import styles from './styles.module.scss'
import bem from '../../utils/bem'

interface Props {
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

class ArticleThumbV2 extends Component<Props, {}> {
  bemClss = bem('lm-article-thumbnail')

  render() {
    const { props, bemClss } = this

    const statusProps = props.status ? props.statusOverrides?.[props.status] : {}

    const data = {
      ...props,
      ...statusProps
    }

    // Assign classes and styles
    const wrapperClasses = [
      data.customClass,
      bemClss.value,
      styles['wrapper']
    ]
    const aboveClasses = [
      bemClss.elt('above').value,
      styles['above']
    ]
    const belowClasses = [
      bemClss.elt('below').value,
      styles['below']
    ]
    const beforeClasses = [
      bemClss.elt('before').value,
      styles['before']
    ]
    const afterClasses = [
      bemClss.elt('after').value,
      styles['after']
    ]
    const topClasses = [
      bemClss.elt('top').value,
      styles['top']
    ]
    const centerClasses = [
      bemClss.elt('center').value,
      styles['center']
    ]
    const bottomClasses = [
      bemClss.elt('bottom').value,
      styles['bottom']
    ]
    const imgWrapperClasses = [
      bemClss.elt('image-wrapper').value,
      styles['image-wrapper']
    ]
    const imgClasses = [
      bemClss.elt('image').value,
      styles['image']
    ]
    const shadeClasses = [
      bemClss.elt('shade').value,
      styles['shade']
    ]

    const shadeStyle = `background: linear-gradient(
      ${data.shadeFromColor ?? 'transparent'} 
      ${data.shadeFromPos ?? '50%'}, 
      ${data.shadeToColor ?? 'rgba(0, 0, 0, 0.3)'} 
      ${data.shadeToPos ?? '100%'});`

    const imageIsSvg = data.imageUrl?.endsWith('.svg')

    const displayBefore = data.textBeforeTop || data.textBeforeCenter || data.textBeforeBottom
    const displayAfter = data.textAfterTop || data.textAfterCenter || data.textAfterBottom
    const displayShade = data.shadeFromColor || data.shadeFromPos || data.shadeToColor || data.shadeToPos

    return <div className={wrapperClasses.join(' ')}>

      {/* styles */}
      {data.customCss && <style>{data.customCss}</style>}

      {/* above */}
      {data.textAbove && <div className={aboveClasses.join(' ')}>{data.textAbove}</div>}

      {/* before */}
      {displayBefore && <div className={beforeClasses.join(' ')}>
        {data.textBeforeTop && <div className={topClasses.join(' ')}>{data.textBeforeTop}</div>}
        {data.textBeforeCenter && <div className={centerClasses.join(' ')}>{data.textBeforeCenter}</div>}
        {data.textBeforeBottom && <div className={bottomClasses.join(' ')}>{data.textBeforeBottom}</div>}
      </div>}

      {/* image-wrapper */}
      <div className={imgWrapperClasses.join(' ')}>

        {/* image */}
        {data.imageUrl && <div className={imgClasses.join(' ')}>
          {imageIsSvg
            ? <Svg src={data.imageUrl} desc={data.imageAlt}></Svg>
            : <Img src={data.imageUrl} alt={data.imageAlt}></Img>}
        </div>}

        {/* shade */}
        {displayShade && <div className={shadeClasses.join(' ')} style={shadeStyle}></div>}

        {/* inside */}
        {data.textInsideTop && <div className={topClasses.join(' ')}>{data.textInsideTop}</div>}
        {data.textInsideCenter && <div className={centerClasses.join(' ')}>{data.textInsideCenter}</div>}
        {data.textInsideBottom && <div className={bottomClasses.join(' ')}>{data.textInsideBottom}</div>}
      </div>

      {/* after */}
      {displayAfter && <div className={afterClasses.join(' ')}>
        {data.textAfterTop && <div className={topClasses.join(' ')}>{data.textAfterTop}</div>}
        {data.textAfterCenter && <div className={centerClasses.join(' ')}>{data.textAfterCenter}</div>}
        {data.textAfterBottom && <div className={bottomClasses.join(' ')}>{data.textAfterBottom}</div>}
      </div>}

      {/* below */}
      {data.textBelow && <div className={belowClasses.join(' ')}>{data.textBelow}</div>}
    </div>
  }
}

export type { Props }
export default ArticleThumbV2
