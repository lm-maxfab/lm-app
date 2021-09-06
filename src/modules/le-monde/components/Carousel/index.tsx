import React, { ReactElement } from 'react'
import clss from 'classnames'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './styles.css'

interface Props {
  className?: string
  style?: React.CSSProperties
  onChange?: (activeSlidePos: number) => void
  prevButton?: React.ReactNode
  nextButton?: React.ReactNode
}

class Carousel extends React.Component<Props, {}> {
  mainClass: string = 'lm-carousel'
  $root: HTMLDivElement|null = null
  $dots: HTMLDivElement|null = null
  slider: Slider|null = null
  dirtyFixTimeouts: number[]|null = null

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
    this.handlePrevClick = this.handlePrevClick.bind(this)
    this.handleNextClick = this.handleNextClick.bind(this)
    this.dirtyAddClassToDots = this.dirtyAddClassToDots.bind(this)
    this.dirtySlickTrackFix = this.dirtySlickTrackFix.bind(this)
    this.cleanDirtySlickTrackFix = this.cleanDirtySlickTrackFix.bind(this)
  }

  /* * * * * * * * * * * * * * * *
   * LIFECYCLE
   * * * * * * * * * * * * * * * */
  componentDidMount (): void {
    this.dirtyAddClassToDots()
    this.dirtySlickTrackFix()
  }

  componentDidUpdate (): void {
    this.dirtyAddClassToDots()
    this.dirtySlickTrackFix()
  }

  componentWillUnmount (): void {
    this.cleanDirtySlickTrackFix()
  }

  /* * * * * * * * * * * * * * *
   * DIRTY ADD CLASS TO DOTS
   * * * * * * * * * * * * * * */
  dirtyAddClassToDots (): void {
    if (this.$dots === null) return
    this.$dots.classList.add(`${this.mainClass}__dots`)
  }

  /* * * * * * * * * * * * * * *
   * DIRTY SLICK TRACK FIX & CLEAN
   * * * * * * * * * * * * * * */
  dirtySlickTrackFix (): void {
    if (this.$root === null) return
    const $root = this.$root
    if (this.dirtyFixTimeouts === null) this.dirtyFixTimeouts = []
    this.dirtyFixTimeouts.push(window.setTimeout(() => {
      const $track = $root.querySelector('.slick-track')
      if ($track !== null) ($track as HTMLElement).style.width = '100000px'
    }, 100))
    this.dirtyFixTimeouts.push(window.setTimeout(() => {
      const $track = $root.querySelector('.slick-track')
      if ($track !== null) ($track as HTMLElement).style.width = '100000px'
    }, 500))
  }

  cleanDirtySlickTrackFix (): void {
    if (this.dirtyFixTimeouts === null) return
    this.dirtyFixTimeouts.forEach(timeout => window.clearTimeout(timeout))
  }

  /* * * * * * * * * * * * * * *
   * HANDLERS
   * * * * * * * * * * * * * * */
  handlePrevClick (): void {
    if (this.slider === null) return
    this.slider.slickPrev()
  }

  handleNextClick (): void {
    if (this.slider === null) return
    this.slider.slickNext()
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): React.ReactNode {
    const { props } = this

    const settings = {
      arrows: false,
      accessibility: true,
      infinite: true,
      speed: 200,
      centerMode: true,
      variableWidth: true,
      slidesToScroll: 1,
      dots: true,
      draggable: true,
      afterChange: props.onChange,
      appendDots: (dots: ReactElement[]) => {
        return <div ref={n => { this.$dots = n }}>{
          dots.map((dot, i) => {
            return (
              <span
                key={i}
                className={`${this.mainClass}__dot`}>
                {dot}
              </span>
            )
          })
        }</div>
      }
    }

    const classes: string = clss(this.mainClass, props.className)
    const inlineStyle = { ...props.style }

    return <div
      className={classes}
      style={inlineStyle}
      ref={n => { this.$root = n }}>
      <Slider
        {...settings}
        className={`${this.mainClass}__slider`}
        ref={n => (this.slider = n)}>
        {React.Children.map(props.children, (child, i) => (
          <div
            key={i}
            onClick={e => this.slider?.slickGoTo(i)}
            className={`${this.mainClass}__slide`}>
            {child}
          </div>
        ))}
      </Slider>
      <div className={`${this.mainClass}__buttons`}>
        <button
          onClick={this.handlePrevClick}
          className={`${this.mainClass}__button ${this.mainClass}__button_prev`}>
          { props.prevButton ?? '<' }
        </button>
        <button
          onClick={this.handleNextClick}
          className={`${this.mainClass}__button ${this.mainClass}__button_next`}>
          { props.nextButton ?? '>' }
        </button>
      </div>
    </div>
  }
}

export type { Props }
export default Carousel
