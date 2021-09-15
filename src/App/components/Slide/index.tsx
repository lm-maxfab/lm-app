import { Component, JSX } from 'preact'
import clss from 'classnames'
import './styles.css'
import HighlightedText from '../../../modules/le-monde/components/HighlightedText'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  data?: any
}

class Slide extends Component<Props, {}> {
  mainClass: string = 'dro-slide'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    // Extract props
    const data = props.data ?? {}

    const backgroundImageUrl = data.background_image_url as string|undefined ?? ''
    const backgroundPatternUrl = data.background_pattern_url as string|undefined
    const backgroundColor = data.background_color as string|undefined

    const title = data.title as JSX.Element|undefined
    const titleColor = data.title_color as string|undefined
    const titleBgColor = data.title_bg_color as string|undefined

    const titleSubtext = data.title_subtext as JSX.Element|undefined
    const titleSubtextColor = data.title_subtext_color as string|undefined

    const illustrationLgUrl = data.illustration_lg_url as string|undefined
    const illustrationMdUrl = data.illustration_md_url as string|undefined ?? illustrationLgUrl
    const illustrationSmUrl = data.illustration_sm_url as string|undefined ?? illustrationMdUrl
    const illustrationTitle = data.illustration_title as JSX.Element|undefined
    const illustrationLegend = data.illustration_legend as JSX.Element|undefined
    const illustrationAltText = data.illustration_alt_text as string|undefined ?? ''
    const illustrationTitleColor = data.illustration_title_color as string|undefined
    const illustrationLegendColor = data.illustration_legend_color as string|undefined

    const exergue = data.exergue as JSX.Element|undefined
    const exergueColor = data.exergue_color as string|undefined
    const exergueEmColor = data.exergue_em_color as string|undefined
    const exergueBgColor = data.exergue_bg_color as string|undefined

    const paragraph = data.paragraph as JSX.Element|undefined
    const paragraphColor = data.paragraph_color as string|undefined
    const paragraphEmBgColor = data.paragraph_em_bg_color as string|undefined

    const quote = data.quote as JSX.Element|undefined
    const quoteLegend = data.quote_legend as JSX.Element|undefined
    const quoteColor = data.quote_color as string|undefined
    const quoteLegendColor = data.quote_legend_color as string|undefined

    // Classes
    const classes: string = clss(this.mainClass, props.className)
    const inlineStyle = {
      ...props.style,
      backgroundColor,
      backgroundImage: backgroundPatternUrl !== undefined
        ? `url(${backgroundPatternUrl})`
        : `url(${backgroundImageUrl})`,
      backgroundSize: backgroundPatternUrl !== undefined
        ? 'auto'
        : 'cover',
      backgroundRepeat: backgroundPatternUrl !== undefined
        ? 'repeat'
        : 'no-repeat',
      '--c-title': titleColor,
      '--c-title-bg': titleBgColor,
      '--c-title-subtext': titleSubtextColor,
      '--c-illustration-title': illustrationTitleColor,
      '--c-illustration-legend': illustrationLegendColor,
      '--c-exergue': exergueColor,
      '--c-exergue-em': exergueEmColor,
      '--c-exergue-bg': exergueBgColor,
      '--c-paragraph': paragraphColor,
      '--c-paragraph-em-bg': paragraphEmBgColor,
      '--c-quote': quoteColor,
      '--c-quote-legend': quoteLegendColor
    }

    // Display
    return (
      <div className={classes} style={inlineStyle}>
        {
          title !== undefined || titleSubtext !== undefined
            ? <h1 className={`${this.mainClass}__title`}>
              <div className={`${this.mainClass}__title-bg`} />
              <div className={`${this.mainClass}__title-content`}>{title}</div>
              <div className={`${this.mainClass}__title-subtext-content`}>{titleSubtext}</div>
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
        {illustrationLegend !== undefined ? <p className={`${this.mainClass}__illus-title`}>{illustrationTitle}</p> : null}
        {illustrationLegend !== undefined ? <p className={`${this.mainClass}__illus-legend`}>{illustrationLegend}</p> : null}
        {
          exergue !== undefined
            ? <HighlightedText
              highlightColor={exergueBgColor}
              offset='calc((var(--len-exergue-line-height) - var(--len-exergue-font-size)) / 2)'
              className={`${this.mainClass}__exergue`}>
              {exergue}
            </HighlightedText>
            : null
        }
        {paragraph !== undefined ? <p className={`${this.mainClass}__paragraph`}>{paragraph}</p> : null}
        {quote !== undefined ? <p className={`${this.mainClass}__quote`}>{quote}</p> : null}
        {quoteLegend !== undefined ? <p className={`${this.mainClass}__quote-legend`}>{quoteLegend}</p> : null}
      </div>
    )
  }
}

export type { Props }
export default Slide
