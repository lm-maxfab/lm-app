import React from 'react'
import clss from 'classnames'
import './styles.css'

interface Props {
  className?: string
  style?: React.CSSProperties
  data?: any
}

class Slide extends React.Component<Props, {}> {
  mainClass: string = 'dro-slide'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): React.ReactNode {
    const { props } = this

    // Extract props
    const data = props.data ?? {}
    const backgroundColor = data.background_color as string|undefined
    const emphasisColor1 = data.emphasis_color_1 as string|undefined
    const emphasisColor2 = data.emphasis_color_2 as string|undefined
    const backgroundImageUrl = data.background_image_url as string|undefined ?? ''
    const title = data.title as React.ReactNode|undefined
    const titleOverlayBoxColor = data.title_overlay_box_color as string|undefined
    const illustrationLgUrl = data.illustration_lg_url as string|undefined
    const illustrationMdUrl = data.illustration_md_url as string|undefined ?? illustrationLgUrl
    const illustrationSmUrl = data.illustration_sm_url as string|undefined ?? illustrationMdUrl
    const illustrationLegend = data.illustration_legend as React.ReactNode|undefined
    const illustrationAltText = data.illustration_alt_text as string|undefined ?? ''
    const exergue = data.exergue as React.ReactNode|undefined
    const paragraph = data.paragraph as React.ReactNode|undefined
    const quote = data.quote as React.ReactNode|undefined
    const quoteLegend = data.quote_legend as React.ReactNode|undefined

    // Logic
    const titleBgStyle = {
      backgroundColor: titleOverlayBoxColor
    }

    // Classes
    const classes: string = clss(this.mainClass, props.className)
    const inlineStyle = {
      ...props.style,
      backgroundColor,
      backgroundImage: `url(${backgroundImageUrl})`,
      '--c-exergue-em-1': emphasisColor1,
      '--c-exergue-em-2': emphasisColor2
    }

    // Display
    return (
      <div className={classes} style={inlineStyle}>
        {
          title !== undefined
            ? <h1 className={`${this.mainClass}__title`}>
              <span className={`${this.mainClass}__title-bg`} style={titleBgStyle} />
              <span className={`${this.mainClass}__title-content`}>{title}</span>
            </h1>
            : null
        }
        {
          illustrationLgUrl !== undefined
            ? <img
                className={`${this.mainClass}__illus ${this.mainClass}__lg-illus`}
                alt={illustrationAltText}
                src={illustrationLgUrl} />
            : null
        }
        {
          illustrationMdUrl !== undefined
            ? <img
                className={`${this.mainClass}__illus ${this.mainClass}__md-illus`}
                alt={illustrationAltText}
                src={illustrationMdUrl} />
            : null
        }
        {
          illustrationSmUrl !== undefined
            ? <img
                className={`${this.mainClass}__illus ${this.mainClass}__sm-illus`}
                alt={illustrationAltText}
                src={illustrationSmUrl} />
            : null
        }
        {illustrationLegend !== undefined ? <p className={`${this.mainClass}__illus-legend`}>{illustrationLegend}</p> : null}
        {exergue !== undefined ? <p className={`${this.mainClass}__exergue`}><span>{exergue}</span></p> : null}
        {paragraph !== undefined ? <p className={`${this.mainClass}__paragraph`}>{paragraph}</p> : null}
        {quote !== undefined ? <p className={`${this.mainClass}__quote`}>{quote}</p> : null}
        {quoteLegend !== undefined ? <p className={`${this.mainClass}__quote-legend`}>{quoteLegend}</p> : null}
      </div>
    )
  }
}

export type { Props }
export default Slide
