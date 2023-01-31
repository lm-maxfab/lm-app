
import { Component, createRef } from 'preact'
import { EpisodeData } from '../../types'
import ResizeObserverComponent from '../../../modules/components/ResizeObserver'
import Arrow from '../Arrow'
import Episode from '../Episode'
import styles from './styles.module.scss'

type Props = {
  episodes: EpisodeData[]
}

type State = {
  isOverflowing: boolean
  displayLeftArrow: boolean
  displayRightArrow: boolean
}

export default class Carousel extends Component<Props, State> {
  state: State = {
    isOverflowing: false,
    displayLeftArrow: false,
    displayRightArrow: false,
  }

  cardWidth: number = 240
  cardGap: number = 20

  snapValues: number[] = []
  scrollValue: number = 0
  maxScrollValue: number = 0

  containerWidth: number = 0

  scrollContainer: any
  cardsContainer: any

  constructor(props: Props) {
    super(props)

    this.scrollContainer = createRef()
    this.cardsContainer = createRef()

    this.handleScroll = this.handleScroll.bind(this)
    this.calculateDimensions = this.calculateDimensions.bind(this)
    this.translateCarousel = this.translateCarousel.bind(this)
  }

  componentDidMount(): void {
    this.calculateDimensions()
    setTimeout(this.calculateDimensions, 1000)
  }

  updateArrows() {
    let displayLeftArrow = false
    let displayRightArrow = false

    if (this.state.isOverflowing) {
      displayLeftArrow = this.scrollValue > 0
      displayRightArrow = this.scrollValue < this.maxScrollValue
    }

    this.setState(curr => ({
      ...curr,
      displayLeftArrow,
      displayRightArrow,
    }))
  }

  handleScroll() {
    this.scrollValue = this.scrollContainer.current.scrollLeft
    this.updateArrows()
  }

  calculateDimensions() {
    this.containerWidth = this.scrollContainer.current.getBoundingClientRect().width
    const cardsWidth = this.props.episodes.length * (this.cardGap + this.cardWidth)
    const shouldOverflow = cardsWidth > this.containerWidth

    const cardsActualWidth = this.cardsContainer?.current.getBoundingClientRect().width
    this.maxScrollValue = cardsActualWidth - this.containerWidth

    this.snapValues = []
    for (let i = 0; i < this.props.episodes.length + 1; i++) {
      this.snapValues.push(i * (this.cardWidth + this.cardGap))
    }

    this.setState(curr => {
      if (curr.isOverflowing === shouldOverflow) return null
      else return {
        ...curr,
        isOverflowing: shouldOverflow
      }
    })

    this.updateArrows()
  }

  translateCarousel(direction: string) {
    if (!this.state.isOverflowing) return

    const scrollAmount =
      this.containerWidth < (this.cardWidth + this.cardGap)
        ? (this.cardWidth + this.cardGap)
        : this.containerWidth

    if (direction === 'next') {
      this.scrollValue += scrollAmount
    } else {
      this.scrollValue -= scrollAmount
    }

    if (this.scrollValue < 0) this.scrollValue = 0

    let filteredValues = [...this.snapValues]

    if (direction === 'next') {
      filteredValues = filteredValues.filter(val => val <= this.scrollValue);
      this.scrollValue = Math.max(...filteredValues);
    } else {
      filteredValues = filteredValues.filter(val => val >= this.scrollValue);
      this.scrollValue = Math.min(...filteredValues);
    }

    if (this.scrollValue > this.maxScrollValue) this.scrollValue = this.maxScrollValue

    if (direction === "next") {
      if (this.maxScrollValue - this.scrollValue < 60) {
        this.scrollValue += (this.maxScrollValue - this.scrollValue)
      }
    }

    this.scrollContainer.current.scrollLeft = this.scrollValue
    this.updateArrows()
  }

  render() {
    const { props, state, cardWidth, cardGap } = this

    const wrapperClasses = [styles['wrapper']]
    const wrapperStyles = {
      ['--cards-nb']: `${props.episodes.length}`,
      ['--card-width']: `${cardWidth}px`,
      ['--card-gap']: `${cardGap}px`
    }

    const arrowLeftClasses = [styles['arrow'], styles['arrow-left']]
    const arrowRightClasses = [styles['arrow'], styles['arrow-right']]

    if (state.displayLeftArrow) arrowLeftClasses.push(styles['arrow-visible'])
    if (state.displayRightArrow) arrowRightClasses.push(styles['arrow-visible'])
    if (state.isOverflowing) wrapperClasses.push(styles['wrapper_overflowing'])

    return <div
      style={wrapperStyles}
      className={wrapperClasses.join(' ')}>

      <ResizeObserverComponent onResize={this.calculateDimensions}>
        <div ref={this.scrollContainer} onScroll={this.handleScroll} className={styles['scrollable']}>
          <div ref={this.cardsContainer} className={styles['cards']}>
            {props.episodes.map((episode) => {
              return <Episode episode={episode as EpisodeData} />
            })}
          </div>
        </div>
      </ResizeObserverComponent>

      <div onClick={() => this.translateCarousel('prev')} className={arrowLeftClasses.join(' ')}>
        <Arrow pointing='left' />
      </div>
      <div onClick={() => this.translateCarousel('next')} className={arrowRightClasses.join(' ')}>
        <Arrow pointing='right' />
      </div>

    </div>
  }
}
