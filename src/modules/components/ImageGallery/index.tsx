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
  mobileSettings?: SectionSettings
  images: ImageProps[]
}

interface GallerySettings extends SectionSettings { }

interface Props {
  customClass?: string
  customCss?: string
  legend?: string
  settings?: GallerySettings
  mobileSettings?: GallerySettings
  sections: SectionProps[]
}

class ImageGallery extends Component<Props, {}> {
  $wrapper: HTMLDivElement | null = null
  wrapperWidth: number = 0
  isMobile: boolean = false

  gallerySettings: GallerySettings = {}

  constructor(props: Props) {
    super(props)

    this.handleResize = this.handleResize.bind(this)
    this.renderSection = this.renderSection.bind(this)
  }

  componentDidMount() {
    this.handleResize()
  }

  handleResize() {
    if (this.$wrapper === null) return

    const wrapperDimensions = this.$wrapper.getBoundingClientRect()
    this.wrapperWidth = wrapperDimensions.width
    this.isMobile = this.wrapperWidth < 500
  }

  renderSection(section: SectionProps) {
    const sectionClasses = [styles['section']]
    const elementClasses = [styles['element']]

    const settings = {
      ...this.gallerySettings,
      ...section.settings,
      ...(this.isMobile ? section.mobileSettings : {})
    }

    const gutterWidth = settings.gutterWidth ?? 10

    if (section.layout === 'row') {
      return (
        <GalleryRow
          {...settings}
          gutterWidth={gutterWidth}
          width={this.wrapperWidth}
          images={section.images}
        />
      )
    }

    let sectionStyle = `--lm-gallery-gutter-width: ${gutterWidth}px;`

    if (section.layout === 'triptych') {
      sectionClasses.push(styles['triptych-section'])
      sectionStyle += ` --lm-triptych-main-column: ${settings.side === 'right' ? 2 : 1};`
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

    const wrapperClasses = ['lm-gallery', props.customClass, styles['wrapper']]
    const legendClasses = [styles['legend']]

    const columnsLayout = props.sections.every(section => section.layout === 'columns')
    if (columnsLayout) wrapperClasses.push(styles['columns-wrapper'])

    this.gallerySettings = {
      ...this.props.settings,
      ...(this.isMobile ? this.props.mobileSettings : {}),
    }

    const wrapperStyle = `
      --lm-gallery-gutter-width: ${this.gallerySettings.gutterWidth ?? 10}px;
      --lm-gallery-sections-number: ${props.sections.length};
    `

    return (
      <ResizeObserverComponent onResize={this.handleResize}>

        <div
          style={wrapperStyle}
          className={wrapperClasses.join(' ')}
          ref={n => { this.$wrapper = n }}
        >
          {props.customCss && <style>{props.customCss}</style>}
          {props.sections.length > 0 && props.sections.map(this.renderSection)}
          {props.legend && <p className={legendClasses.join(' ')}>{props.legend}</p>}
        </div>

      </ResizeObserverComponent>
    )
  }
}

export type { Props, SectionProps, SectionSettings, RowSettings, ImageProps }
export default ImageGallery
