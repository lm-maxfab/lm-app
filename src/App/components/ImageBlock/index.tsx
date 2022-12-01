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
  clss = 'photos22-image-block'

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
    const strDescriptionContent = fakeDiv.innerText.split('&nbsp;').join(' ')

    const isPano = /^pan/.test(data.image_ratio?.toLowerCase() ?? '')
    const isLandscape = /^pay/.test(data.image_ratio?.toLowerCase() ?? '')
    const isSquare = /^c/.test(data.image_ratio?.toLowerCase() ?? '')
    const isPortrait = /^po/.test(data.image_ratio?.toLowerCase() ?? '')
    const isStrip = /^s/.test(data.image_ratio?.toLowerCase() ?? '')

    const dateRegex = /\d{4}\/\d{2}\/\d{2}/i
    const imageDate = data.image_url.match(dateRegex) ? data.image_url.match(dateRegex)![0] : ''
    const imageName = data.image_url.substring(data.image_url.lastIndexOf('/') + 1, data.image_url.lastIndexOf('.'))
    const imageExt = data.image_url.substring(data.image_url.lastIndexOf('.') + 1)

    const widths = [2400, 1800, 1400, 1000, 800, 600]
    const srcSet = widths.map(width => {
      let ratio = 1
      if (isPano || isLandscape) ratio = 1
      if (isSquare) ratio = .66
      if (isPortrait) ratio = .5
      if (isStrip) ratio = .3
      const targetFileName = `https://img.lemde.fr/${imageDate}/0/0/0/0/${width}/0/0/0/${imageName}.${imageExt}`
      const targetWidthName = `${Math.floor(width / ratio)}w`
      return `${targetFileName} ${targetWidthName}`
    }).join(', ')
    const src = `https://img.lemde.fr/${imageDate}/0/0/0/0/${2200}/0/0/0/${imageName}.${imageExt}`

    /* Classes and style */
    const classes = bem(props.className ?? '')
      .block(this.clss)
      .mod({
        ['ratio-pano']: isPano,
        ['ratio-landscape']: isLandscape,
        ['ratio-square']: isSquare,
        ['ratio-portrait']: isPortrait,
        ['ratio-strip']: isStrip
      })
    const inlineStyle: JSX.CSSProperties = { ...props.style }
    const imageClasses = bem(this.clss).elt('image')

    return <div className={classes.value} style={inlineStyle}>
      <Img
        src={src}
        srcSet={srcSet}
        alt={data.alt ?? strDescriptionContent}
        className={imageClasses.value} />
      <span className={bem(this.clss).elt('text').value}>
        <span className={bem(this.clss).elt('description').value}>{data.description}&nbsp;</span>
        <span className={bem(this.clss).elt('credits').value}>{data.credits}</span>
      </span>
    </div>
  }
}

export type { Props }
export default ImageBlock
