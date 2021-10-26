import { Component, Context, JSX } from 'preact'
import clss from 'classnames'
import { SheetBase, EntryValue } from '../modules/spreadsheets/tsv-base-to-js-object-base'
import Carousel from '../modules/le-monde/components/Carousel'
import Svg from '../modules/le-monde/components/Svg'
import AppContext from '../context'
import './styles.css'
import Slide from './components/Slide'
import leftArrow from './assets/left-arrow-icon.svg'
import rightArrow from './assets/right-arrow-icon.svg'

const initHashStr = window.parseInt(window.location.hash.replace(/#/gm, ''))
const initPage = Number.isNaN(initHashStr) ? 0 : initHashStr

interface Props {
  className?: string
  style?: JSX.CSSProperties
  sheet_data?: SheetBase
}

interface State {
  active_slide_pos: number
}

class App extends Component<Props, State> {
  mainClass: string = 'lm-app'
  state = { active_slide_pos: initPage }
  carousel: Carousel|null = null
  static contextType: Context<any> = AppContext

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
    this.handleCarouselChange = this.handleCarouselChange.bind(this)
  }

  componentDidMount () {
    this.carousel?.slider.slickGoTo(initPage)
  }

  /* * * * * * * * * * * * * * *
   * HANDLERS
   * * * * * * * * * * * * * * */
  handleCarouselChange (activeSlidePos: number): void {
    this.setState((current: State) => {
      if (activeSlidePos === current.active_slide_pos) return null
      window.location.hash = `${activeSlidePos}`
      return {
        ...current,
        active_slide_pos: activeSlidePos
      }
    })
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props, state, context } = this
    const { config } = context

    // Logic
    const settings = props.sheet_data?.collections[1]?.value[0] ?? {}

    const progressionBarColor = settings.progression_bar_color as string|undefined
    const progressionBarBgColor = settings.progression_bar_bg_color as string|undefined
    const buttonsBackgroundColor = settings.buttons_background_color as string|undefined
    const buttonsArrowColor = settings.buttons_arrow_color as string|undefined

    const titleLgFontSize = settings.title_lg_font_size as string|undefined
    const titleMdFontSize = settings.title_md_font_size as string|undefined ?? titleLgFontSize
    const titleSmFontSize = settings.title_sm_font_size as string|undefined ?? titleMdFontSize
    const titleLgLineHeight = settings.title_lg_line_height as string|undefined
    const titleMdLineHeight = settings.title_md_line_height as string|undefined ?? titleLgLineHeight
    const titleSmLineHeight = settings.title_sm_line_height as string|undefined ?? titleMdLineHeight

    const titleSubtextLgFontSize = settings.title_subtext_lg_font_size as string|undefined
    const titleSubtextMdFontSize = settings.title_subtext_md_font_size as string|undefined ?? titleSubtextLgFontSize
    const titleSubtextSmFontSize = settings.title_subtext_sm_font_size as string|undefined ?? titleSubtextMdFontSize
    const titleSubtextLgLineHeight = settings.title_subtext_lg_line_height as string|undefined
    const titleSubtextMdLineHeight = settings.title_subtext_md_line_height as string|undefined ?? titleSubtextLgLineHeight
    const titleSubtextSmLineHeight = settings.title_subtext_sm_line_height as string|undefined ?? titleSubtextMdLineHeight

    const illustrationTitleLgFontSize = settings.illustration_title_lg_font_size as string|undefined
    const illustrationTitleMdFontSize = settings.illustration_title_md_font_size as string|undefined ?? illustrationTitleLgFontSize
    const illustrationTitleSmFontSize = settings.illustration_title_sm_font_size as string|undefined ?? illustrationTitleMdFontSize
    const illustrationTitleLgLineHeight = settings.illustration_title_lg_line_height as string|undefined
    const illustrationTitleMdLineHeight = settings.illustration_title_md_line_height as string|undefined ?? illustrationTitleLgLineHeight
    const illustrationTitleSmLineHeight = settings.illustration_title_sm_line_height as string|undefined ?? illustrationTitleMdLineHeight

    const illustrationLegendLgFontSize = settings.illustration_legend_lg_font_size as string|undefined
    const illustrationLegendMdFontSize = settings.illustration_legend_md_font_size as string|undefined ?? illustrationLegendLgFontSize
    const illustrationLegendSmFontSize = settings.illustration_legend_sm_font_size as string|undefined ?? illustrationLegendMdFontSize
    const illustrationLegendLgLineHeight = settings.illustration_legend_lg_line_height as string|undefined
    const illustrationLegendMdLineHeight = settings.illustration_legend_md_line_height as string|undefined ?? illustrationLegendLgLineHeight
    const illustrationLegendSmLineHeight = settings.illustration_legend_sm_line_height as string|undefined ?? illustrationLegendMdLineHeight

    const exergueLgFontSize = settings.exergue_lg_font_size as string|undefined
    const exergueMdFontSize = settings.exergue_md_font_size as string|undefined ?? exergueLgFontSize
    const exergueSmFontSize = settings.exergue_sm_font_size as string|undefined ?? exergueMdFontSize
    const exergueLgLineHeight = settings.exergue_lg_line_height as string|undefined
    const exergueMdLineHeight = settings.exergue_md_line_height as string|undefined ?? exergueLgLineHeight
    const exergueSmLineHeight = settings.exergue_sm_line_height as string|undefined ?? exergueMdLineHeight

    const paragraphLgFontSize = settings.paragraph_lg_font_size as string|undefined
    const paragraphMdFontSize = settings.paragraph_md_font_size as string|undefined ?? paragraphLgFontSize
    const paragraphSmFontSize = settings.paragraph_sm_font_size as string|undefined ?? paragraphMdFontSize
    const paragraphLgLineHeight = settings.paragraph_lg_line_height as string|undefined
    const paragraphMdLineHeight = settings.paragraph_md_line_height as string|undefined ?? paragraphLgLineHeight
    const paragraphSmLineHeight = settings.paragraph_sm_line_height as string|undefined ?? paragraphMdLineHeight

    const quoteLgFontSize = settings.quote_lg_font_size as string|undefined
    const quoteMdFontSize = settings.quote_md_font_size as string|undefined ?? quoteLgFontSize
    const quoteSmFontSize = settings.quote_sm_font_size as string|undefined ?? quoteMdFontSize
    const quoteLgLineHeight = settings.quote_lg_line_height as string|undefined
    const quoteMdLineHeight = settings.quote_md_line_height as string|undefined ?? quoteLgLineHeight
    const quoteSmLineHeight = settings.quote_sm_line_height as string|undefined ?? quoteMdLineHeight

    const quoteLegendLgFontSize = settings.quote_legend_lg_font_size as string|undefined
    const quoteLegendMdFontSize = settings.quote_legend_md_font_size as string|undefined ?? quoteLegendLgFontSize
    const quoteLegendSmFontSize = settings.quote_legend_sm_font_size as string|undefined ?? quoteLegendMdFontSize
    const quoteLegendLgLineHeight = settings.quote_legend_lg_line_height as string|undefined
    const quoteLegendMdLineHeight = settings.quote_legend_md_line_height as string|undefined ?? quoteLegendLgLineHeight
    const quoteLegendSmLineHeight = settings.quote_legend_sm_line_height as string|undefined ?? quoteLegendMdLineHeight

    const allPages = props.sheet_data?.collections[0].value ?? []
    const pages = allPages.filter(page => page.publish)
    const progression = state.active_slide_pos / (pages.length - 1)
    const isFirstPage = state.active_slide_pos === 0
    const isLastPage = state.active_slide_pos === pages.length - 1

    const prevButton = (() => {
      if (isFirstPage) return false
      return <span>
        <Svg src={leftArrow} />
      </span>
    })()
    const nextButton = (() => {
      if (isLastPage) return false
      return <span>
        <Svg src={rightArrow} />
      </span>
    })()

    // Classes
    const classes: string = clss(this.mainClass, props.className)
    const inlineStyle = {
      ...props.style,
      '--len-progression-bar-width': `${progression * 100}%`,
      '--c-progression-bar': progressionBarColor,
      '--c-progression-bar-bg': progressionBarBgColor,
      '--c-buttons-bg': buttonsBackgroundColor,
      '--c-buttons-arrow': buttonsArrowColor,
      '--len-title-lg-font-size': titleLgFontSize,
      '--len-title-md-font-size': titleMdFontSize,
      '--len-title-sm-font-size': titleSmFontSize,
      '--len-title-lg-line-height': titleLgLineHeight,
      '--len-title-md-line-height': titleMdLineHeight,
      '--len-title-sm-line-height': titleSmLineHeight,
      '--len-title-subtext-lg-font-size': titleSubtextLgFontSize,
      '--len-title-subtext-md-font-size': titleSubtextMdFontSize,
      '--len-title-subtext-sm-font-size': titleSubtextSmFontSize,
      '--len-title-subtext-lg-line-height': titleSubtextLgLineHeight,
      '--len-title-subtext-md-line-height': titleSubtextMdLineHeight,
      '--len-title-subtext-sm-line-height': titleSubtextSmLineHeight,
      '--len-illustration-title-lg-font-size': illustrationTitleLgFontSize,
      '--len-illustration-title-md-font-size': illustrationTitleMdFontSize,
      '--len-illustration-title-sm-font-size': illustrationTitleSmFontSize,
      '--len-illustration-title-lg-line-height': illustrationTitleLgLineHeight,
      '--len-illustration-title-md-line-height': illustrationTitleMdLineHeight,
      '--len-illustration-title-sm-line-height': illustrationTitleSmLineHeight,
      '--len-illustration-legend-lg-font-size': illustrationLegendLgFontSize,
      '--len-illustration-legend-md-font-size': illustrationLegendMdFontSize,
      '--len-illustration-legend-sm-font-size': illustrationLegendSmFontSize,
      '--len-illustration-legend-lg-line-height': illustrationLegendLgLineHeight,
      '--len-illustration-legend-md-line-height': illustrationLegendMdLineHeight,
      '--len-illustration-legend-sm-line-height': illustrationLegendSmLineHeight,
      '--len-exergue-lg-font-size': exergueLgFontSize,
      '--len-exergue-md-font-size': exergueMdFontSize,
      '--len-exergue-sm-font-size': exergueSmFontSize,
      '--len-exergue-lg-line-height': exergueLgLineHeight,
      '--len-exergue-md-line-height': exergueMdLineHeight,
      '--len-exergue-sm-line-height': exergueSmLineHeight,
      '--len-paragraph-lg-font-size': paragraphLgFontSize,
      '--len-paragraph-md-font-size': paragraphMdFontSize,
      '--len-paragraph-sm-font-size': paragraphSmFontSize,
      '--len-paragraph-lg-line-height': paragraphLgLineHeight,
      '--len-paragraph-md-line-height': paragraphMdLineHeight,
      '--len-paragraph-sm-line-height': paragraphSmLineHeight,
      '--len-quote-lg-font-size': quoteLgFontSize,
      '--len-quote-md-font-size': quoteMdFontSize,
      '--len-quote-sm-font-size': quoteSmFontSize,
      '--len-quote-lg-line-height': quoteLgLineHeight,
      '--len-quote-md-line-height': quoteMdLineHeight,
      '--len-quote-sm-line-height': quoteSmLineHeight,
      '--len-quote-legend-lg-font-size': quoteLegendLgFontSize,
      '--len-quote-legend-md-font-size': quoteLegendMdFontSize,
      '--len-quote-legend-sm-font-size': quoteLegendSmFontSize,
      '--len-quote-legend-lg-line-height': quoteLegendLgLineHeight,
      '--len-quote-legend-md-line-height': quoteLegendMdLineHeight,
      '--len-quote-legend-sm-line-height': quoteLegendSmLineHeight,
      marginTop: 'var(--len-nav-height)'
    }

    // Display
    return (
      <div
        id={config.project_short_name}
        className={classes}
        style={inlineStyle}>
        <div className={`${this.mainClass}__progression-bar`}>
          <div className={`${this.mainClass}__progression-bar-inner`} />
        </div>
        <Carousel
          ref={$n => this.carousel = $n}
          initialSlide={initPage}
          infinite={false}
          draggable={document.documentElement.clientWidth <= 800}
          onChange={this.handleCarouselChange}
          prevButton={prevButton}
          nextButton={nextButton}>
          {pages.map((pageData: EntryValue, pos: number) => <Slide key={pos} data={pageData} />)}
        </Carousel>
      </div>
    )
  }
}

export type { Props, State }
export default App
