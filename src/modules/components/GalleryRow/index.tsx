import { Component, VNode } from 'preact'
import styles from './styles.module.scss'

import { RowSettings, ImageProps } from '../ImageGallery'
import Img from '../Img'

interface Props extends RowSettings {
  images: ImageProps[]
  width: number
}

interface State {
  loading: boolean
}

class GalleryRow extends Component<Props, {}> {
  state: State = {
    loading: true,
  }

  imagesCount: number = 0
  imagesRatio: number = 0
  imagesHeight: number = 300
  gutterWidth: number = 10

  equalColumns: boolean = false

  constructor(props: Props) {
    super(props)

    this.loadImages = this.loadImages.bind(this)
    this.calculateHeight = this.calculateHeight.bind(this)

    if (props.equalColumns != undefined) this.equalColumns = props.equalColumns
    if (props.gutterWidth != undefined) this.gutterWidth = props.gutterWidth
  }

  async componentDidMount(): Promise<any> {
    await this.loadImages()
  }

  async loadImages() {
    for (const element of this.props.images) {
      const img = new Image()
      img.src = element.url

      img.onload = (e) => {
        const target = e.target as HTMLImageElement
        const ratio = target?.width / target?.height

        // on additionne tous les ratios d'images pour obtenir le ratio de la ligne
        this.imagesRatio += ratio
        this.imagesCount++

        if (this.imagesCount === this.props.images.length) {
          this.calculateHeight()
          this.setState({ loading: false })
        }
      }
    }
  }

  calculateHeight() {
    const margins = this.gutterWidth * (this.imagesCount - 1)
    const availableWidth = this.props.width - margins
    return availableWidth / this.imagesRatio
  }

  render() {
    const { props } = this

    const rowClasses = [styles['row']]
    const elementClasses = [styles['element']]

    if (this.equalColumns === true || props.forcedHeight != undefined) rowClasses.push(styles['equal-columns'])

    this.imagesHeight = this.calculateHeight()

    const rowStyle = `
      --lm-gallery-row-height: ${props.forcedHeight ?? this.imagesHeight + 'px'};
      --lm-gallery-row-img-position: ${props.imagesPosition ?? 'center'};
      --lm-gallery-gutter-width: ${this.gutterWidth}px;
      --lm-gallery-row-cols: ${this.imagesCount};
    `

    return (
      <div
        className={rowClasses.join(' ')}
        style={rowStyle}
      >
        {props.images.map((img) => {
          return <div className={elementClasses.join(' ')}>
            <Img src={img.url} alt={img.alt} />
          </div>
        })}
      </div>
    )
  }
}

export type { Props }
export default GalleryRow
