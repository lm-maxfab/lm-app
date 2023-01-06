import { Component, JSX, createRef } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import { GeneralData, EpisodeData } from '../types'
import './styles.scss'

import getConfig from '../../modules/utils/get-config'
import Episode from '../components/Episode'
import { Arrow } from '../components/Arrow'

const config = getConfig()

interface Props extends InjectedProps { }
interface State {
  displayPrevArrow: boolean,
  displayNextArrow: boolean,
}

class Footer extends Component<Props, State> {
  episodesWrapperRef: any
  episodesCarouselRef: any
  carouselImageWidth: number
  carouselTranslateValue: number
  carouselTranslateSnapValues: number[]
  wrapperWidth: number
  carouselWidth: number
  maxTranslateValue: number

  constructor() {
    super()

    this.episodesWrapperRef = createRef();
    this.episodesCarouselRef = createRef();
    this.carouselImageWidth = 244; // largeur de l'image (224) + grid gap (20)
    this.carouselTranslateValue = 0;
    this.carouselTranslateSnapValues = []
    this.wrapperWidth = 0
    this.carouselWidth = 0
    this.maxTranslateValue = 0

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

  calculateDimensions() {
    const wrapper = this.episodesWrapperRef.current
    const carousel = this.episodesCarouselRef.current

    this.wrapperWidth = wrapper.getBoundingClientRect().width
    this.carouselWidth = carousel.getBoundingClientRect().width
    this.maxTranslateValue = this.carouselWidth - this.wrapperWidth
  }

  updateArrows() {
    let displayPrevArrow = true
    let displayNextArrow = true

    if (this.wrapperWidth > this.carouselWidth) {
      displayPrevArrow = false
      displayNextArrow = false
    } else {
      displayPrevArrow = this.carouselTranslateValue >= 0 ? false : true
      displayNextArrow = Math.abs(this.carouselTranslateValue) >= this.maxTranslateValue ? false : true
    }

    this.setState(curr => ({
      ...curr,
      displayPrevArrow,
      displayNextArrow,
    }))
  }

  handleResize() {
    console.log(this.episodesCarouselRef)
    const carousel = this.episodesCarouselRef.current
    this.calculateDimensions()

    console.log(this.handleResize)

    if (this.wrapperWidth > this.carouselWidth) {
      carousel.style.transform = `translateX(0px)`
    } else if (Math.abs(this.carouselTranslateValue) > this.maxTranslateValue) {
      this.carouselTranslateValue = -this.maxTranslateValue;
      carousel.style.transform = `translateX(${this.carouselTranslateValue}px)`
    }

    this.updateArrows()
  }


  translateCarousel(direction: string) {
    console.log('on translate!')
    console.log(direction)

    if (this.wrapperWidth > this.carouselWidth) return

    const carousel = this.episodesCarouselRef.current
    const scrollValue = this.wrapperWidth < this.carouselImageWidth ? this.carouselImageWidth : this.wrapperWidth

    if (direction === 'next') {
      this.carouselTranslateValue -= scrollValue
    } else {
      this.carouselTranslateValue += scrollValue
    }

    if (this.carouselTranslateValue > this.carouselTranslateSnapValues[1] && this.carouselTranslateValue < 0) {
      this.carouselTranslateValue = this.carouselTranslateSnapValues[1]
    }

    if (this.carouselTranslateValue > 0) this.carouselTranslateValue = 0

    let filteredValues = [...this.carouselTranslateSnapValues]

    console.log('max', this.maxTranslateValue)
    console.log('snap values', filteredValues)

    if (direction === 'next') {
      filteredValues = filteredValues.filter(val => val >= this.carouselTranslateValue);
      this.carouselTranslateValue = Math.min(...filteredValues);
    } else {
      filteredValues = filteredValues.filter(val => val <= this.carouselTranslateValue);
      this.carouselTranslateValue = Math.max(...filteredValues);
    }

    if (Math.abs(this.carouselTranslateValue) > this.maxTranslateValue) {
      this.carouselTranslateValue = -this.maxTranslateValue;
    }

    console.log(this.maxTranslateValue + this.carouselTranslateValue)

    if (this.maxTranslateValue + this.carouselTranslateValue < 60) {
      console.log('on rallonge pour éviter une étape awkward....')
      console.log(this.maxTranslateValue + this.carouselTranslateValue)
      this.carouselTranslateValue -= (this.maxTranslateValue + this.carouselTranslateValue)
    }

    console.log(this.carouselTranslateValue)

    carousel.style.transform = `translateX(${this.carouselTranslateValue}px)`

    this.updateArrows()
  }


  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render(): JSX.Element {
    const { props } = this

    const generalData = props.sheetBase?.collection('general').value[0] as unknown as GeneralData;
    const episodesData = props.sheetBase?.collection('episodes').value ?? [] as unknown as EpisodeData[];

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      ['--crim-footer-c-background']: '#181A1E',
      ['--crim-footer-episodes-nb']: episodesData.length,
    }

    this.carouselTranslateSnapValues = []
    for (let i = 0; i < episodesData.length + 1; i++) {
      this.carouselTranslateSnapValues.push(- i * this.carouselImageWidth)
    }


    // Display

    return <div
      style={wrapperStyle}
      class="crim-footer">

      <div class="crim-footer__header">
        <h3 class="crim-footer__title">{generalData.title}</h3>
        <p class="crim-footer__chapo">{generalData.chapo}</p>
      </div>

      <div ref={this.episodesWrapperRef} class="crim-footer__episodes_wrapper">
        <div ref={this.episodesCarouselRef} class="crim-footer__episodes">
          <div class="crim-footer__episodes_grid">
            {episodesData.map((episode) => {
              return <>
                <Episode episode={episode as EpisodeData} /></>
            })}
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
