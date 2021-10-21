import { Component, JSX } from 'preact'
import clss from 'classnames'
import { SheetBase } from '../modules/sheet-base'
import { Fragment as FragmentInterface, PageSettings } from './types'
import ctaArrow from './assets/footer-cta-arrow.svg'
import './snippet-foot.css'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  sheetBase?: SheetBase
  currentFragmentId?: string
}

class App extends Component<Props, {}> {
  mainClass: string = 'lm-app-fragments-snippet-foot'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    // Classes
    const classes: string = clss(this.mainClass, props.className)
    const inlineStyle = { ...props.style }

    const sheetBase = props.sheetBase ?? new SheetBase()
    const fragments = (sheetBase.collection('fragments').value as unknown as FragmentInterface[]).filter(frag => frag.publish === true)
    const pageSettings = sheetBase.collection('page_settings').entry('settings').value as unknown as PageSettings
    const currentFragment = fragments.find(fragment => fragment.id === props.currentFragmentId)
    const currentFragmentThematicId = (currentFragment?.related_thematics_ids ?? '').split(',').map(id => id.trim())[0]
    const relatedFragments = fragments
      .filter(fragment => (fragment.related_thematics_ids ?? '')
        .split(',')
        .map(id => id.trim())
        .some(id => id === currentFragmentThematicId)
      ).filter(fragments => fragments.id !== currentFragment?.id)
    const aboutStyle = { backgroundImage: `url(${pageSettings.footer_about_bg_image_url})` }
    
    // Display
    if (pageSettings.show_footer_in_snippet !== true) return <></>
    return (
      <div className={classes} style={inlineStyle}>
        <div style={aboutStyle} className={`${this.mainClass}__about`}>
          <div className={`${this.mainClass}__about-opacifier`} />
          <div className={`${this.mainClass}__marqueur`}><img src={pageSettings.footer_marqueur_url ?? ''} /></div>
          <div className={`${this.mainClass}__about-paragraph`}>{pageSettings.footer_about_paragraph}</div>
          <a href={pageSettings.longform_url} className={`${this.mainClass}__cta`}>
            <div className={`${this.mainClass}__cta-text`}>{pageSettings.footer_cta}</div>
            <div className={`${this.mainClass}__cta-icon`}><img src={ctaArrow} /></div>
          </a>
          <div className={`${this.mainClass}__list-label`}>{pageSettings.footer_list_label}</div>
        </div>
        <div className={`${this.mainClass}__list`}>
          {relatedFragments.map(fragment => {
            const imageSlotStyle = { backgroundImage: fragment?.id !== undefined ? `url(https://assets-decodeurs.lemonde.fr/redacweb/5-2110-fragments-icono/${fragment.id}_grid_hd.jpg)` : '' }
            const imageSlotOpacifierStyle = { backgroundColor: `rgb(0, 0, 0, ${(fragment?.longform_grid_snippet_opacifier_opacity ?? 27) / 100})` }
            return <div className={`${this.mainClass}__related-fragment`}>
              <a href={fragment.url}>
                <div style={imageSlotStyle} className={`${this.mainClass}__related-fragment-image`}>
                  <div style={imageSlotOpacifierStyle} className={`${this.mainClass}__related-fragment-image-opacifier`} />
                  <div className={`${this.mainClass}__related-fragment-image-texts`}>
                    <div className={`${this.mainClass}__related-fragment-image-supertitle`}>{fragment?.supertitle}</div>
                    <div className={`${this.mainClass}__related-fragment-image-title`}>{fragment?.title}</div>
                  </div>
                </div>
              </a>
            </div>
          })}
        </div>
      </div>
    )
  }
}

export type { Props }
export default App
