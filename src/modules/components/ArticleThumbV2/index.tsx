import { Component, VNode } from 'preact'
import Svg from '../Svg'
import Img from '../Img'
import styles from './styles.module.scss'

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
  render() {
    const { props } = this

    const statusProps = props.status ? props.statusOverrides?.[props.status] : {}

    const data = {
      ...props,
      ...statusProps
    }

    // Assign classes and styles
    const wrapperClasses = [styles['wrapper'], data.customClass]

    const aboveClass = styles['above']
    const belowClass = styles['below']
    const beforeClass = styles['before']
    const afterClass = styles['after']
    const topClass = styles['top']
    const centerClass = styles['center']
    const bottomClass = styles['bottom']
    const imgWrapperClass = styles['image-wrapper']

    const shadeStyle = `background: linear-gradient(
      ${data.shadeFromColor ?? 'transparent'} 
      ${data.shadeFromPos ?? '50%'}, 
      ${data.shadeToColor ?? 'rgba(0, 0, 0, 0.3)'} 
      ${data.shadeToPos ?? '100%'});`

    const imageIsSvg = data.imageUrl?.endsWith('.svg')

    const displayBefore = data.textBeforeTop || data.textBeforeCenter || data.textBeforeBottom
    const displayAfter = data.textAfterTop || data.textAfterCenter || data.textAfterBottom

    if (!displayAfter && !displayBefore) {
      wrapperClasses.push(styles['single-col'])
    } else if ((displayBefore && displayAfter)) {
      wrapperClasses.push(styles['three-cols'])
    } else {
      wrapperClasses.push(styles['two-cols'])
    }

    return <div className={wrapperClasses.join(' ')}>

      {/* styles */}
      {data.customCss && <style>{data.customCss}</style>}

      {/* above */}
      {data.textAbove && <div className={aboveClass}>{data.textAbove}</div>}

      {/* before */}
      {displayBefore && <div className={beforeClass}>
        {data.textBeforeTop && <div className={topClass}>{data.textBeforeTop}</div>}
        {data.textBeforeCenter && <div className={centerClass}>{data.textBeforeCenter}</div>}
        {data.textBeforeBottom && <div className={bottomClass}>{data.textBeforeBottom}</div>}
      </div>}

      {/* image-wrapper */}
      <div className={imgWrapperClass}>

        {/* image */}
        {data.imageUrl && <div>
          {imageIsSvg
            ? <Svg src={data.imageUrl} desc={data.imageAlt}></Svg>
            : <Img src={data.imageUrl} alt={data.imageAlt}></Img>}
        </div>}

        {/* shade */}
        <div style={shadeStyle}></div>

        {/* inside */}
        {data.textInsideTop && <div className={topClass}>{data.textInsideTop}</div>}
        {data.textInsideCenter && <div className={centerClass}>{data.textInsideCenter}</div>}
        {data.textInsideBottom && <div className={bottomClass}>{data.textInsideBottom}</div>}
      </div>

      {/* after */}
      {displayAfter && <div className={afterClass}>
        {data.textAfterTop && <div className={topClass}>{data.textAfterTop}</div>}
        {data.textAfterCenter && <div className={centerClass}>{data.textAfterCenter}</div>}
        {data.textAfterBottom && <div className={bottomClass}>{data.textAfterBottom}</div>}
      </div>}

      {/* below */}
      {data.textBelow && <div className={belowClass}>{data.textBelow}</div>}
    </div>
  }
}

export type { Props }
export default ArticleThumbV2
