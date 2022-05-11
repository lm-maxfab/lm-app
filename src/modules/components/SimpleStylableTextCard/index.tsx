import { Component, JSX, VNode } from 'preact'
import bem from '../../utils/bem'
import fakeUuid from '../../utils/fake-uuid'

import './styles.scss'

interface StyleVariantDescriptor {
  variant_name?: string
  selector?: string
  max_width?: number
  inline_style?: string
}

interface Props {
  className?: string
  style?: JSX.CSSProperties
  content?: VNode|string
  textAlign?: string
  variantNames?: string
  styleVariants?: StyleVariantDescriptor[]
}

class SimpleStylableTextCard extends Component<Props, {}> {
  static clss = 'lm-simple-stylable-text-card'
  clss = SimpleStylableTextCard.clss
  uuid = fakeUuid()

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Logic */
    const variants = props.variantNames?.split(',').map(e => e.trim())
    
    const customStyle = props.styleVariants?.map(ruleSet => {
      if (ruleSet.inline_style === ''
        || ruleSet.inline_style === undefined
        || ruleSet.variant_name === ''
        || ruleSet.variant_name === undefined
        || !variants?.includes(ruleSet.variant_name)) return
      const textBlockSelector = `#${this.uuid}.lm-simple-stylable-text-card.lm-simple-stylable-text-card_style-variant-${ruleSet.variant_name}`
      const selector = ruleSet.selector !== undefined
        ? ruleSet.selector.split(',').map(e => e.trim()).map(sel => `${textBlockSelector} ${sel}`).join(',\n')
        : textBlockSelector
      const formattedStyle = ruleSet.inline_style?.split(';').filter(e => e !== '').map(e => `  ${e.trim()};`).join('\n')
      const noMediaQueryRule = `${selector} {\n${formattedStyle}\n}`
      const mediaQueryRule = ruleSet.max_width !== undefined ? `@media screen and (max-width: ${ruleSet.max_width}px)` : undefined
      const finalRule = mediaQueryRule !== undefined ? `${mediaQueryRule} {\n  ${noMediaQueryRule.split('\n').join('\n  ')}\n}` : noMediaQueryRule
      return finalRule
    }).filter(e => e !== undefined).join('\n\n')

    /* Classes and style */
    const wrapperClasses = bem(props.className).block(this.clss)
    if (variants !== undefined) variants.forEach(variant => wrapperClasses.addModifier(`style-variant-${variant}`))
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      '--text-align': props.textAlign
    }

    /* Display */
    return (
      <div
        id={this.uuid}
        style={wrapperStyle}
        className={wrapperClasses.value}>
        {customStyle !== '' ? <style>{customStyle}</style> : null}
        {props.content}
      </div>
    )
  }
}

export type { Props }
export default SimpleStylableTextCard
