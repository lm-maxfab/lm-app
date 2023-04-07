import { Component, VNode } from 'preact'
import styles from './styles.module.scss'

import ResizeObserverComponent from '../ResizeObserver'
import GalleryRow from '../GalleryRow'
import GalleryImage from '../GalleryImage'
import ImageLegend from '../ImageLegend'

interface ImageProps {
  url: string
  alt?: string
  legend?: string
  credits?: string
}

interface RowSettings {
  equalColumns?: boolean
  colsNumber?: number
  imagesPosition?: 'bottom' | 'center' | 'top'
  forcedHeight?: string
  gutterWidth?: number
}

interface TriptychSettings {
  side?: 'left' | 'right'
  gutterWidth?: number
}

interface BoardSettings {
  colsNumber?: number
  gutterWidth?: number
}

interface SectionSettings extends RowSettings, TriptychSettings, BoardSettings { }

interface SectionProps {
  layout: 'row' | 'columns' | 'triptych' | 'board'
  settings?: SectionSettings
  mobileSettings?: SectionSettings
  images: ImageProps[]
}

interface GallerySettings extends SectionSettings { }

interface Props {
  customClass?: string
  customCss?: string
  legend?: string
  credits?: string
  settings?: GallerySettings
  mobileSettings?: GallerySettings
  sections: SectionProps[]
}

class Gallery extends Component<Props, {}> {
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
    sectionClasses.push(styles[`section--${section.layout}`])

    const settings = {
      ...this.gallerySettings,
      ...section.settings,
      ...(this.isMobile ? section.mobileSettings : {})
    }

    const gutterWidth = settings.gutterWidth ?? 10

    if (section.layout === 'row') {
      return (
        <div className={sectionClasses.join(' ')}>
          <GalleryRow
            {...settings}
            gutterWidth={gutterWidth}
            width={this.wrapperWidth}
            images={section.images}
          />
        </div>
      )
    }

    let sectionStyle = `--lm-gallery-gutter-width: ${gutterWidth}px;`

    if (section.layout === 'triptych') {
      sectionStyle += ` --lm-triptych-main-column: ${settings.side === 'right' ? 2 : 1};`
    }

    if (section.layout === 'board') {
      sectionStyle += ` --lm-board-columns-number: ${settings.colsNumber};`
    }

    return (
      <div
        style={sectionStyle}
        className={sectionClasses.join(' ')}
      >
        {section.images.map((img) => {
          return <GalleryImage {...img} />
        })}
      </div>
    )
  }

  render() {
    const { props } = this

    const containerClasses = ['lm-gallery', props.customClass, styles['container']]
    const containerStyle = `
      --lm-gallery-gutter-width: ${this.gallerySettings.gutterWidth ?? 10}px;
      --lm-gallery-sections-number: ${props.sections.length};
    `

    const wrapperClasses = [styles['wrapper']]

    const columnsLayout = props.sections.every(section => section.layout === 'columns')
    if (columnsLayout) wrapperClasses.push(styles['columns-wrapper'])

    this.gallerySettings = {
      ...this.props.settings,
      ...(this.isMobile ? this.props.mobileSettings : {}),
    }


    const displayLegend = props.legend || props.credits

    return (
      <div
        style={containerStyle}
        className={containerClasses.join(' ')}
      >
        {props.customCss && <style>{props.customCss}</style>}

        <ResizeObserverComponent onResize={this.handleResize}>
          {/* un wrapper à part pour la taille au cas où padding custom sur le container */}
          <div className={wrapperClasses.join(' ')} ref={n => { this.$wrapper = n }}>
            {props.sections.length > 0 && props.sections.map(this.renderSection)}
          </div>
        </ResizeObserverComponent>

        {displayLegend && <ImageLegend legend={props.legend} credits={props.credits} />}
      </div>
    )
  }
}

export type { Props, SectionProps, SectionSettings, RowSettings, ImageProps }
export default Gallery
