import React from 'react'
import clss from 'classnames'
import './styles.css'
import type { EntryValue } from '../../../modules/spreadsheets/tsv-base-to-js-object-base'
import Parallax from '../../../modules/le-monde/components/Parallax'

interface Props {
  className?: string
  style?: React.CSSProperties
  data: EntryValue
}

class Slide extends React.Component<Props, {}> {
  color: string|null = null
  constructor (props: Props) {
    super(props)
    this.color = new Array(3).fill(null).map(e => Math.floor(Math.random() * 256)).join(',')
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): React.ReactNode {
    const { props } = this

    // Logic
    const slideData = props.data

    // CSS classes & style
    const mainClass = 'slide'
    const displayClass = `${mainClass}_${slideData.type}`
    const classes: string = clss(
      mainClass,
      displayClass,
      props.className
    )
    const inlineStyle = { ...props.style }

    // Display
    return (
      <div
        className={classes}
        style={inlineStyle}>
        <Parallax render={percent => {
          const wrapperStyle = { opacity: `${Math.min(percent + 1, 1)}` }
          // const titleStyle = { transform: `translate(calc(-2 * var(--vw)), calc(${200 * percent}px))` }
          // const mainParagraphStyle = { transform: `translateY(calc(${180 * percent}px))` }
          // const sideParagraphStyle = { transform: `translateY(calc(${180 * percent}px))` }
          // const imageStyle = { transform: `translateY(calc(${240 * percent}px - var(--len-slide-image-parallax-offset)))` }
          const titleStyle = { transform: `translate(calc(-2 * var(--vw)), calc(${300 * percent}px))` }
          const mainParagraphStyle = { transform: `translateY(calc(${270 * percent}px))` }
          const sideParagraphStyle = { transform: `translateY(calc(${270 * percent}px))` }
          const imageStyle = { transform: `translateY(calc(${360 * percent}px - var(--len-slide-image-parallax-offset)))` }
          return (
            <div
              style={wrapperStyle}
              className={`${mainClass}__inner`}>
              <div
                className={`${mainClass}__bg-image`}
                style={{ backgroundImage: `url('${slideData.bg_image_url}')`, }} />
                <div className={`${mainClass}__top-half`}>
                <div
                  style={titleStyle}
                  className={`${mainClass}__title`}>{slideData.title}</div>
              </div>
              <a href={slideData.link_url} className={`${mainClass}__bottom-half`}>
                <div
                  style={mainParagraphStyle}
                  className={`${mainClass}__main-paragraph`}>
                  <p className={`${mainClass}__text`}>{slideData.text}</p>
                  <span className={`${mainClass}__link`}>Lire l'enquête</span>
                </div>
                <div
                  style={sideParagraphStyle}
                  className={`${mainClass}__side-paragraph`}>{slideData.side_text}</div>
                <img
                  style={imageStyle}
                  className={`${mainClass}__image`} src={slideData.main_image_url} />
              </a>
            </div>
          )
        }} />
      </div>
    )
  }
}

export type { Props }
export default Slide
