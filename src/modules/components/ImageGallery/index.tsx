import { Component, VNode } from 'preact'
import styles from './styles.module.scss'

import ResizeObserverComponent from '../ResizeObserver'
import GalleryRow from '../GalleryRow'
import Img from '../Img'

interface ImageProps {
  url: string
  alt?: string
}

interface RowSettings {
  equalColumns?: boolean
  imagesPosition?: 'bottom' | 'center' | 'top'
  forcedHeight?: string
  gutterWidth?: number
}

interface TriptychSettings {
  side?: 'left' | 'right'
  gutterWidth?: number
}

interface SectionSettings extends RowSettings, TriptychSettings { }

interface SectionProps {
  layout: 'row' | 'columns' | 'triptych'
  settings?: SectionSettings
  images: ImageProps[]
}

interface Props {
  customClass?: string
  customCss?: string
  legend: string
  sections: SectionProps[]
}

class ImageGallery extends Component<Props, {}> {
  $wrapper: HTMLDivElement | null = null
  wrapperWidth: number = 0

  constructor(props: Props) {
    super(props)

    this.updateWrapperWidth = this.updateWrapperWidth.bind(this)
    this.renderSection = this.renderSection.bind(this)
  }

  componentDidMount() {
    this.updateWrapperWidth()
  }

  updateWrapperWidth() {
    if (this.$wrapper === null) return

    const wrapperDimensions = this.$wrapper.getBoundingClientRect()
    this.wrapperWidth = wrapperDimensions.width
  }

  renderSection(section: SectionProps) {
    const sectionClasses = [styles['section']]
    const elementClasses = [styles['element']]

    const gutterWidth = section.settings?.gutterWidth ?? 10

    if (section.layout === 'row') {
      return (
        <GalleryRow
          {...section.settings}
          gutterWidth={gutterWidth}
          width={this.wrapperWidth}
          images={section.images}
        />
      )
    }

    let sectionStyle = `--lm-gallery-gutter-width: ${gutterWidth}px;`

    if (section.layout === 'triptych') {
      sectionClasses.push(styles['triptych-section'])
      sectionStyle += ` --lm-triptych-main-column: ${section.settings?.side === 'right' ? 2 : 1};`
    }

    return (
      <div
        style={sectionStyle}
        className={sectionClasses.join(' ')}
      >
        {section.images.map((img) => {
          return <div className={elementClasses.join(' ')}>
            <Img src={img.url} alt={img.alt} />
          </div>
        })}
      </div>
    )
  }

  render() {
    const { props } = this

    const wrapperClasses = [props.customClass, styles['wrapper']]
    const legendClasses = [styles['legend']]

    const columnsLayout = props.sections.every(section => section.layout === 'columns')
    if (columnsLayout) wrapperClasses.push(styles['columns-wrapper'])

    const wrapperStyle = `
      --lm-gallery-sections-number: ${props.sections.length};
    `

    return (
      <ResizeObserverComponent onResize={this.updateWrapperWidth}>

        <div
          style={wrapperStyle}
          className={wrapperClasses.join(' ')}
          ref={n => { this.$wrapper = n }}
        >
          {props.sections.length > 0 && props.sections.map(this.renderSection)}
          {props.legend && <p className={legendClasses.join(' ')}>{props.legend}</p>}
        </div>

      </ResizeObserverComponent>
    )
  }
}

export type { Props, SectionProps, SectionSettings, RowSettings, ImageProps }
export default ImageGallery
