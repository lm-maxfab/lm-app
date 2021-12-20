import { Component, JSX } from 'preact'
import Img from '../../../modules/le-monde/components/Img'
import bem from '../../../modules/le-monde/utils/bem'
import { ImageBlockData } from '../../types'
import './styles.scss'
import img1400 from './assets/1400.png'
import img1000 from './assets/1000.png'
import img600 from './assets/600.png'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  data?: ImageBlockData
}

class ImageBlock extends Component<Props, {}> {
  clss = 'photos21-image-block'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this
    const { data } = props

    /* Logic */
    if (data === undefined) return null
    if (data.image_url === undefined) return null
    const descriptionContent = data.description?.props.content
    const fakeDiv = document.createElement('div')
    fakeDiv.innerHTML = descriptionContent ?? ''
    const strDescriptionContent = fakeDiv.innerText

    const widths = [740, 1000, 1500, 2000]
    // const widths = new Array(3).fill(null).map((_e, i) => 500 + 500 * i)
    const imageName = (data.image_url ?? '').split('.').slice(0, -1).join('.')
    const imageExt = (data.image_url ?? '').replace(new RegExp(`^${imageName}.`, 'gm'), '')
    const srcSet = widths.map(width => {
      const targetFileName = `${imageName}.${width}.q40.comp.${imageExt}`
      const targetWidthName = `${width}w`
      return `${targetFileName} ${targetWidthName}`
    }).join(', ')

    /* Classes and style */
    const classes = bem(props.className ?? '').block(this.clss)
    const inlineStyle: JSX.CSSProperties = { ...props.style }
    const imageClasses = bem(this.clss).elt('image').mod({
      ['ratio-pano']: /^pan/.test(data.image_ratio?.toLowerCase() ?? ''),
      ['ratio-landscape']: /^pay/.test(data.image_ratio?.toLowerCase() ?? ''),
      ['ratio-square']: /^c/.test(data.image_ratio?.toLowerCase() ?? ''),
      ['ratio-portrait']: /^po/.test(data.image_ratio?.toLowerCase() ?? ''),
      ['ratio-strip']: /^s/.test(data.image_ratio?.toLowerCase() ?? '')
    })

    return <div className={classes.value} style={inlineStyle}>
      <Img
        src={data.image_url}
        srcSet={srcSet}
        alt={strDescriptionContent}
        className={imageClasses.value} />
      {/* <picture>
        <source media='(min-width: 1400px)' srcSet={img1400} />
        <source media='(min-width: 1000px)' srcSet={img1000} />
        <source media='(min-width: 600px)' srcSet={img600} />
        <Img src={data.image_url} alt={strDescriptionContent} className={imageClasses.value} />
      </picture> */}
      <span className={bem(this.clss).elt('text').value}>
        <span className={bem(this.clss).elt('description').value}>{data.description}&nbsp;</span>
        <span className={bem(this.clss).elt('credits').value}>{data.credits}</span>
      </span>
    </div>

    // const { props } = this
    // const { data } = props

    // /* Logic */
    // if (data === undefined) return null
    // if (data.image_url === undefined) return null

    // const imageName = (data.image_url ?? '').split('.').slice(0, -1).join('.')
    // const imageExt = (data.image_url ?? '').replace(new RegExp(`^${imageName}.`, 'gm'), '')
    // const widths = new Array(12).fill(null).map((_e, i) => 400 + i * 150)
    // const srcSet = widths.map(width => {
    //   const targetFileName = `${imageName}.${width}.comp.${imageExt}`
    //   const targetWidthName = `${width}w`
    //   return `${targetFileName} ${targetWidthName}`
    // }).join(', ')
    // const sizes = widths.map(width => `(max-width: ${width}px) ${width}px`).join(', ')

    // /* Classes and style */
    // const classes = bem(props.className ?? '').block(this.clss)
    // const inlineStyle: JSX.CSSProperties = { ...props.style }
    // const imageClasses = bem(this.clss).elt('image').mod({
    //   ['ratio-pano']: /^pan/.test(data.image_ratio?.toLowerCase() ?? ''),
    //   ['ratio-landscape']: /^pay/.test(data.image_ratio?.toLowerCase() ?? ''),
    //   ['ratio-square']: /^c/.test(data.image_ratio?.toLowerCase() ?? ''),
    //   ['ratio-portrait']: /^po/.test(data.image_ratio?.toLowerCase() ?? ''),
    //   ['ratio-strip']: /^s/.test(data.image_ratio?.toLowerCase() ?? '')
    // })

    // /* Display */
    // return (
    //   <div className={classes.value} style={inlineStyle}>
    //     <div className={bem(this.clss).elt('inner').value}>
    //       <Img
    //         className={imageClasses.value}
    //         src={data.image_url}
    //         alt={data.description}
    //         srcSet={''/*srcSet*/}
    //         sizes={''/*sizes*/} />
    //       <div className={bem(this.clss).elt('text').value}>
    //         <span className={bem(this.clss).elt('description').value}>{data.description}&nbsp;</span>
    //         <span className={bem(this.clss).elt('credits').value}>{data.credits}</span>
    //       </div>
    //     </div>
    //   </div>
    // )
  }
}

export type { Props }
export default ImageBlock
