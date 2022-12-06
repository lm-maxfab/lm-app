import { Component, JSX } from 'preact'
import { IntroSlideData, SlideData } from '../../types'
import bem from '../../../modules/le-monde/utils/bem'
import './styles.scss'
import Slide from '../Slide'
import IntroSlide from '../IntroSlide'
import Arrow from '../Arrow'
import ArticleHeader from '../../../modules/le-monde/components/ArticleHeader'

interface Props {
  data?: (IntroSlideData | SlideData)[]
  className?: string
  style?: JSX.CSSProperties
}

interface State {
  currentSlidePos: number
}

class Slider extends Component<Props, State> {
  clss = 'fraude-slider'
  $root: HTMLDivElement | null = null

  /* * * * * * * * * * * * * * *
   * INIT STATE
   * * * * * * * * * * * * * * */
  state: State = {
    currentSlidePos: 0
  }
  url: URL

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR
   * * * * * * * * * * * * * * */
  constructor(props: Props) {
    super(props)

    this.url = new URL(window.location.href)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handlePrevClick = this.handlePrevClick.bind(this)
    this.handleNextClick = this.handleNextClick.bind(this)
    this.asyncSetState = this.asyncSetState.bind(this)
  }

  componentDidMount(): void {
    if (this.url.searchParams.get('slide')) {
      const targetIndex = Number(this.url.searchParams.get('slide'))
      this.goToSlide(targetIndex)
    }

    document.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount(): void {
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  /* * * * * * * * * * * * * * *
   * HANDLERS
   * * * * * * * * * * * * * * */
  handleKeyDown(e: JSX.TargetedKeyboardEvent<any>): void {
    // arrow left
    if (e.keyCode === 37) {
      this.handlePrevClick()
      return
    }

    // arrow right
    if (e.keyCode === 39) {
      this.handleNextClick()
      return
    }
  }

  async handlePrevClick(e?: JSX.TargetedMouseEvent<HTMLButtonElement>): Promise<void> {
    e?.preventDefault()
    await this.asyncSetState((curr: State) => {
      if (this.props.data === undefined) return
      const currPos = curr.currentSlidePos
      const newPos = currPos > 0 ? currPos - 1 : 0
      this.updateURL(newPos)
      return { ...curr, currentSlidePos: newPos }
    })
  }

  async handleNextClick(e?: JSX.TargetedMouseEvent<HTMLButtonElement>): Promise<void> {
    e?.preventDefault()
    await this.asyncSetState((curr: State) => {
      if (this.props.data === undefined) return
      const currPos = curr.currentSlidePos
      const maxPos = this.props.data.length - 1
      const newPos = currPos < maxPos ? currPos + 1 : currPos
      this.updateURL(newPos)
      return { ...curr, currentSlidePos: newPos }
    })
  }

  async goToSlide(index: number): Promise<void> {
    await this.asyncSetState((curr: State) => {
      if (this.props.data === undefined) return
      this.updateURL(index)
      return { ...curr, currentSlidePos: index }
    })
  }

  updateURL(index: number) {
    this.url.searchParams.set('slide', index.toString());
    window.history.replaceState({}, '', this.url)
  }

  /* * * * * * * * * * * * * * *
   * METHODS
   * * * * * * * * * * * * * * */
  async asyncSetState(s: any): Promise<true> {
    return await new Promise(resolve => this.setState(s, () => resolve(true)))
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render(): JSX.Element {
    const { props, state } = this

    /* Logic */
    const prevButtonClass = bem(this.clss).elt('arrow').mod('prev').value
    const nextButtonClass = bem(this.clss).elt('arrow').mod('next').value
    const currSlidePos = state.currentSlidePos
    const slides = props.data?.map((slideData, slidePos) => {
      let clss
      if (slidePos < currSlidePos) clss = bem(this.clss).elt('slide').mod('passed')
      else if (slidePos === currSlidePos) clss = bem(this.clss).elt('slide').mod('current')
      else clss = bem(this.clss).elt('slide').mod('to-come')
      const loading = slidePos === currSlidePos + 1 ? 'eager' : 'lazy'

      if (slidePos === 0) {
        return <div className={clss.value}>
          <IntroSlide
            key={slideData.id}
            imageLoading={loading}
            data={slideData as IntroSlideData}
            onStart={() => this.goToSlide(1)} />
        </div>
      } else {
        return <div className={clss.value}>
          <Slide
            key={slideData.id}
            imageLoading={loading}
            data={slideData as SlideData} />
        </div>
      }
    })
    const readProgressionRate = currSlidePos / ((slides?.length ?? 1) - 1)

    /* Assign classes & styles */
    const classes = bem(props.className ?? '').block(this.clss)
    const inlineStyle: JSX.CSSProperties = { ...props.style }
    const progBarInnerStyle: JSX.CSSProperties = { width: `${100 * readProgressionRate}%` }

    /* Display */
    return (
      <div className={classes.value} style={inlineStyle} ref={node => { this.$root = node }}>
        {/* Progression bar */}
        <div className={bem(this.clss).elt('progression-bar').value}>
          {/* <div
            style={progBarInnerStyle}
            className={bem(this.clss).elt('progression-bar-inner').value} /> */}
          {props.data?.map((_el, index) => {
            return <div
              className={bem(this.clss).elt('progression-bar-slot').mod({ dark: index <= currSlidePos }).value}
              onClick={() => this.goToSlide(index)}
            ></div>
          })}
        </div>

        <div className={bem(this.clss).elt('logo').value}>
          <ArticleHeader
            fill1='black'
            fill2='rgb(0,0,0,.3)' />
        </div>

        {/* Slides */}
        {slides}

        {/* Actions */}
        {currSlidePos !== 0 && <button
          onClick={this.handlePrevClick}
          className={prevButtonClass}>
          <Arrow direction="left" />
        </button>}
        {(currSlidePos + 1) !== slides?.length && <button
          onClick={this.handleNextClick}
          className={nextButtonClass}>
          <div>
            <Arrow direction="right" />
          </div>
        </button>}
      </div>
    )
  }
}

export type { Props }
export default Slider
