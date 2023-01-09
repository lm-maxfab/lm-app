import { Component, JSX, createRef } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import { GeneralData, EpisodeData } from '../types'
import './styles.scss'

import Episode from '../components/Episode'
import Arrow from '../components/Arrow'
import Button from '../components/Button'

interface Props extends InjectedProps { }
interface State {
  displayPrevArrow: boolean,
  displayNextArrow: boolean,
}

class Footer extends Component<Props, State> {
  episodesCarouselRef: any
  episodesScrollContainerRef: any
  carouselImageWidth: number
  carouselScrollValue: number
  carouselTranslateSnapValues: number[]
  containerWidth: number
  carouselWidth: number
  maxScrollValue: number

  constructor() {
    super()

    this.episodesCarouselRef = createRef();
    this.episodesScrollContainerRef = createRef();
    this.carouselImageWidth = 244; // largeur de l'image + grid gap/nb d'images
    this.carouselScrollValue = 0;
    this.carouselTranslateSnapValues = []
    this.containerWidth = 0
    this.carouselWidth = 0
    this.maxScrollValue = 0

    this.handleResize = this.handleResize.bind(this);
  }

  static clss: string = 'crim-footer'
  clss = Footer.clss

  state: State = {
    displayPrevArrow: false,
    displayNextArrow: false,
  }


  componentDidMount() {
    window.addEventListener('resize', this.handleResize)

    this.calculateDimensions()
    this.updateArrows()
  }

  handleScroll() {
    this.carouselScrollValue = this.episodesScrollContainerRef.current.scrollLeft
    this.updateArrows()
  }

  calculateDimensions() {
    const scrollContainer = this.episodesScrollContainerRef.current
    const carousel = this.episodesCarouselRef.current

    this.containerWidth = scrollContainer.getBoundingClientRect().width
    this.carouselWidth = carousel.getBoundingClientRect().width
    this.maxScrollValue = this.carouselWidth - this.containerWidth
  }

  updateArrows() {
    let displayPrevArrow = true
    let displayNextArrow = true

    if (this.containerWidth > this.carouselWidth) {
      displayPrevArrow = false
      displayNextArrow = false
    } else {
      displayPrevArrow = this.carouselScrollValue <= 0 ? false : true
      displayNextArrow = this.carouselScrollValue >= this.maxScrollValue ? false : true
    }

    this.setState(curr => ({
      ...curr,
      displayPrevArrow,
      displayNextArrow,
    }))
  }

  handleResize() {
    const scrollContainer = this.episodesScrollContainerRef.current
    this.calculateDimensions()

    if (this.containerWidth > this.carouselWidth) {
      scrollContainer.scrollLeft = 0
    } else if (this.carouselScrollValue > this.maxScrollValue) {
      this.carouselScrollValue = this.maxScrollValue;
      scrollContainer.scrollLeft = this.carouselScrollValue
    }

    this.updateArrows()
  }


  translateCarousel(direction: string) {
    if (this.containerWidth > this.carouselWidth) return

    const scrollValue = this.containerWidth < this.carouselImageWidth ? this.carouselImageWidth : this.containerWidth

    if (direction === 'next') {
      this.carouselScrollValue += scrollValue
    } else {
      this.carouselScrollValue -= scrollValue
    }

    if (this.carouselScrollValue < this.carouselTranslateSnapValues[1] && this.carouselScrollValue > 0) {
      this.carouselScrollValue = this.carouselTranslateSnapValues[1]
    }

    if (this.carouselScrollValue < 0) this.carouselScrollValue = 0

    let filteredValues = [...this.carouselTranslateSnapValues]

    if (direction === 'next') {
      filteredValues = filteredValues.filter(val => val <= this.carouselScrollValue);
      this.carouselScrollValue = Math.max(...filteredValues);
    } else {
      filteredValues = filteredValues.filter(val => val >= this.carouselScrollValue);
      this.carouselScrollValue = Math.min(...filteredValues);
    }

    if (this.carouselScrollValue > this.maxScrollValue) {
      this.carouselScrollValue = this.maxScrollValue;
    }

    if (direction === "next") {
      if (this.maxScrollValue - this.carouselScrollValue < 60) {
        this.carouselScrollValue += (this.maxScrollValue - this.carouselScrollValue)
      }
    }

    this.episodesScrollContainerRef.current.scroll({
      left: this.carouselScrollValue,
      behavior: 'smooth'
    });

    this.updateArrows()
  }


  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render(): JSX.Element {
    const { props } = this

    const generalData = props.sheetBase?.collection('general').value[0] as unknown as GeneralData;
    const episodesData = props.sheetBase?.collection('episodes').value ?? [] as unknown as EpisodeData[];

    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      ['--crim-footer-c-background']: '#181A1E',
      ['--crim-footer-c-cta-text']: '#1A1E25',
      ['--crim-footer-c-light']: '#C4C4C4',
      ['--crim-footer-c-lightest']: '#EBEBEB',
      ['--crim-footer-episodes-nb']: episodesData.length,
      ['--crim-footer-wrapper-width']: episodesData.length * this.carouselImageWidth + 'px',
    }

    this.carouselTranslateSnapValues = []
    for (let i = 0; i < episodesData.length + 1; i++) {
      this.carouselTranslateSnapValues.push(i * this.carouselImageWidth)
    }

    // Display

    return <div
      style={wrapperStyle}
      class="crim-footer">

      <div class="crim-footer__header">
        <h3 class="crim-footer__title">{generalData.title}</h3>
        <p class="crim-footer__chapo">{generalData.chapo}</p>
        {generalData.cta_url ?
          <Button text={generalData.cta_text} url={generalData.cta_url} />
          : ''}
      </div>

      <div class="crim-footer__episodes_wrapper">
        <div ref={this.episodesScrollContainerRef} onScroll={() => this.handleScroll()} class="crim-footer__episodes_scrollable">
          <div ref={this.episodesCarouselRef} class="crim-footer__episodes">
            <div class="crim-footer__episodes_grid">
              {episodesData.map((episode) => {
                return <>
                  <Episode episode={episode as EpisodeData} /></>
              })}
            </div>
          </div>
        </div>
        <div class="crim-footer__episodes_arrows">
          {this.state.displayPrevArrow && <div class="crim-footer__episodes_arrow crim-footer__episodes_arrow--left" onClick={() => this.translateCarousel('prev')}>
            <Arrow pointing='left'></Arrow>
          </div>}
          {this.state.displayNextArrow && <div class="crim-footer__episodes_arrow crim-footer__episodes_arrow--right" onClick={() => this.translateCarousel('next')}>
            <Arrow pointing='right'></Arrow>
          </div>}
        </div>
      </div>

    </div>

  }
}

export type { Props, Footer }
export default appWrapper(Footer)
