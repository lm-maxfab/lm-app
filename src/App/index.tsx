import React from 'react'
import clss from 'classnames'
import type { SheetBase, EntryValue } from '../modules/spreadsheets/tsv-base-to-js-object-base'
import Carousel from '../modules/le-monde/components/Carousel'
import AppContext from '../context'
import './styles.css'
import Slide from './components/Slide'

interface Props {
  className?: string
  style?: React.CSSProperties
  sheet_data?: SheetBase
}

interface State {
  active_slide_pos: number|null
}

class App extends React.Component<Props, State> {
  mainClass: string = 'lm-app'
  state = { active_slide_pos: null }
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
    const progression = (state.active_slide_pos ?? 0) / (pages.length - 1)
    const progressionBarStyle = {
      width: `${progression * 100}%`,
      backgroundColor: settings.progression_bar_color
    }

    // Classes
    const classes: string = clss(this.mainClass, props.className)
    const inlineStyle = { ...props.style, marginTop: 'var(--len-nav-height)' }

    // Display
    return (
      <div
        id={config.project_short_name}
        className={classes}
        style={inlineStyle}>
        <div
          style={progressionBarStyle}
          className={`${this.mainClass}__progression-bar`} />
        <Carousel
          onChange={this.handleCarouselChange}>
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
