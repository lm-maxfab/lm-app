import React from 'react'
import clss from 'classnames'
import type { SheetBase, EntryValue } from 'modules/spreadsheets/tsv-base-to-js-object-base'
import Carousel from 'modules/le-monde/components/Carousel'
import Svg from 'modules/le-monde/components/Svg'
import AppContext from '../context'
import './styles.css'
import Slide from './components/Slide'
import leftArrow from './assets/left-arrow-icon.svg'
import rightArrow from './assets/right-arrow-icon.svg'

interface Props {
  className?: string
  style?: React.CSSProperties
  sheet_data?: SheetBase
}

interface State {
  active_slide_pos: number
}

class App extends React.Component<Props, State> {
  mainClass: string = 'lm-app'
  state = { active_slide_pos: 0 }
  static contextType: React.Context<any> = AppContext

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
    this.handleCarouselChange = this.handleCarouselChange.bind(this)
  }

  /* * * * * * * * * * * * * * *
   * HANDLERS
   * * * * * * * * * * * * * * */
  handleCarouselChange (activeSlidePos: number): void {
    this.setState((current: State) => {
      if (activeSlidePos === current.active_slide_pos) return null
      return {
        ...current,
        active_slide_pos: activeSlidePos
      }
    })
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): React.ReactNode {
    const { props, state, context } = this
    const { config } = context

    // Logic
    const allPages = props.sheet_data?.collections[0].value ?? []
    const settings = props.sheet_data?.collections[1]?.value[0] ?? {}
    const pages = allPages.filter(page => page.publish)
    const progression = state.active_slide_pos / (pages.length - 1)
    const isFirstPage = state.active_slide_pos === 0
    const isLastPage = state.active_slide_pos === pages.length - 1

    const progressionBarColor = settings.progression_bar_color as string|undefined
    const progressionBarBgColor = settings.progression_bar_bg_color as string|undefined
    const buttonsBackgroundColor = settings.buttons_background_color as string|undefined
    const buttonsArrowColor = settings.buttons_arrow_color as string|undefined

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
          infinite={false}
          onChange={this.handleCarouselChange}
          prevButton={prevButton}
          nextButton={nextButton}>
          {pages.map((pageData: EntryValue, pos: number) => {
            return <Slide
              key={pos}
              data={pageData} />
          })}
        </Carousel>
      </div>
    )
  }
}

export type { Props, State }
export default App
