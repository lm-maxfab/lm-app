import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import ImageFader from '../../modules/components/ImageFader'
import Paginator from '../../modules/components/Paginator'
import TextBlock from '../components/TextBlock'
import { CreditsData, PageData, StyleVariantsData } from '../types'
import './styles.scss'
import ArticleCredits from '../../modules/components/ArticleCredits'
import fakeUuid from '../../modules/utils/fake-uuid'

interface Props extends InjectedProps {}
interface State {
  currentPageData?: PageData
}

class Longform extends Component<Props, State> {
  static clss: string = 'cdc-longform'
  clss = Longform.clss
  uuid = fakeUuid()

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props, state } = this

    // Extract data
    const pagesData = (props.sheetBase?.collection('pages').value ?? []) as unknown as PageData[]
    const creditsData = (props.sheetBase?.collection('credits').entry('1').value ?? {}) as unknown as CreditsData
    const styleVariantsData = (props.sheetBase?.collection('style-variants').value ?? []) as unknown as StyleVariantsData[]

    const customStyle = styleVariantsData.map(ruleSet => {
      if (ruleSet.inline_style === '') return
      if (ruleSet.variant_name === '') return
      let textBlockSelector = `#${this.uuid}`
      textBlockSelector += ` .cdc-text-block.cdc-text-block_style-variant-${ruleSet.variant_name}`
      let selector = ''
      if (ruleSet.selector === undefined) {
        selector = textBlockSelector
      } else {
        selector = ruleSet.selector
          .split(',')
          .map(e => e.trim())
          .map(sel => `${textBlockSelector} ${sel}`)
          .join(',\n')
      }
      const formattedStyle = ruleSet.inline_style?.split(';')
        .filter(e => e !== '')
        .map(e => `  ${e.trim()};`)
        .join('\n')
      const noMediaQueryRule = `${selector} {\n${formattedStyle}\n}`
      const mediaQueryRule = ruleSet.max_width !== undefined
        ? `@media screen and (max-width: ${ruleSet.max_width}px)`
        : undefined
      const finalRule = mediaQueryRule !== undefined
        ? `${mediaQueryRule} {\n  ${noMediaQueryRule.split('\n').join('\n  ')}\n}`
        : noMediaQueryRule
      return finalRule
    }).filter(e => e !== undefined).join('\n\n')
    
    const mobileImages = pagesData.map(pageData => pageData.mobile_image_url).filter(e => e !== undefined) as string[]
    const desktopImages = pagesData.map(pageData => pageData.desktop_image_url).filter(e => e !== undefined) as string[]
    const imagesToPreload = window.innerWidth > 800 ? desktopImages : mobileImages

    const currentImage = window.innerWidth > 800
      ? state.currentPageData?.desktop_image_url
      : state.currentPageData?.mobile_image_url

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    // Display
    return <div
      id={this.uuid}
      style={wrapperStyle}
      className={wrapperClasses.value}>
      <style>{customStyle}</style>
      <div className={bem(this.clss).elt('fixed-image-slot').value}>
        <ImageFader
          preload={imagesToPreload}
          current={currentImage} />
      </div>
      <div className={bem(this.clss).elt('content-slot').value}>
        <Paginator
          root='window'
          direction='vertical'
          thresholdOffset='80%'
          delay={50}
          onPageChange={value => {
            this.setState({ currentPageData: value })
          }}>
          {pagesData.map(pageData => {
            const pageStyle: JSX.CSSProperties = {
              '--padding-top': pageData.padding_top ?? '30vh',
              '--padding-bottom': pageData.padding_bottom ?? '30vh',
              '--justify-content': pageData.position === 'center'
                ? 'center'
                : pageData.position === 'right'
                  ? 'flex-end'
                  : 'flex-start'
            }
            return <Paginator.Page value={pageData}>
              <div
                style={pageStyle}
                className={bem(this.clss).elt('page').value}>
                <TextBlock  
                  textAlign={pageData.text_align}
                  content={pageData.text_block_content}
                  desktopVariants={pageData.desktop_box_style_variants}
                  mobileVariants={pageData.mobile_box_style_variants} />
              </div>
            </Paginator.Page>
          })}
        </Paginator>
      </div>
      <div className={bem(this.clss).elt('credits-slot').value}>
        <ArticleCredits content={creditsData.content} />
      </div>
    </div>
  }
}

export type { Props, Longform }
export default appWrapper(Longform)
