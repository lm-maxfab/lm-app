import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'

import Scrollator from '../../modules/layouts/Scrollator'
import ArticleHeader from '../../modules/components/ArticleHeader'
import ArticleCredits from '../../modules/components/ArticleCredits'

import { PageData, SettingsData, CreditsData, CustomCssData, FooterData, FooterThumbData } from '../types'
import './styles.scss'
import ArticleSeriesHighlight from '../../modules/components/ArticleSeriesHighlight'

interface Props extends InjectedProps {}

class Longform extends Component<Props, {}> {
  static clss: string = 'nov-13-longform'
  clss = Longform.clss

  /* * * * * * * * * * * * * * *
   * LIFECYCLE
   * * * * * * * * * * * * * * */
  componentDidMount () {
    const allCustomCssData = (this.props.sheetBase?.collection('custom-css').value ?? []) as unknown as CustomCssData[]
    const customCssData = allCustomCssData.map(elt => elt.css).join('\n')
    if (customCssData === '') return
    const head = document.head
    const style = document.createElement('style')
    style.setAttribute('type', 'text/css')
    style.innerText = customCssData
    head.append(style)
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    // Pull data from spreadsheet
    const pagesData = (props.sheetBase?.collection('scrollator-pages').value ?? []) as unknown as PageData[]
    const settingsData = (props.sheetBase?.collection('scrollator-settings').entries[0]?.value ?? {}) as unknown as SettingsData
    const creditsData = (props.sheetBase?.collection('credits').entries[0]?.value ?? {}) as unknown as CreditsData
    const footerData = (props.sheetBase?.collection('footer-data').entries[0]?.value ?? {}) as unknown as FooterData
    const footerThumbsData = ((props.sheetBase?.collection('footer-thumbs').value ?? []) as unknown as FooterThumbData[]).map(thumbData => ({
      bgImageUrl: thumbData.bgImageUrl,
      title: thumbData.title,
      articleUrl: thumbData.articleUrl,
      openNewTab: thumbData.openNewTab,
      filterColor: thumbData.filterColor,
      filterColorHover: thumbData.filterColorHover
    }))

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      position: 'relative'
    }

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      <ArticleHeader
        className='nov-13-longform__header'
        fill1={'white'}
        fill2={'rgb(255, 255, 255, .3)'} />
      <Scrollator
        pagesData={pagesData}
        fixedBlocksPanelHeight='100vh'
        animationDuration={300}
        thresholdOffset={settingsData?.scrollator_threshold_offset} />
      <ArticleSeriesHighlight
        title={footerData.title}
        paragraph={footerData.paragraph}
        buttonContent={footerData.button_text}
        buttonUrl={footerData.button_url}
        buttonOpensNewTab={footerData.button_opens_new_tab}
        thumbsData={footerThumbsData} />
      <ArticleCredits
        className='nov-13-longform__credits-test'
        content={creditsData.content} />
    </div>
  }
}

export type { Props, Longform }
export default appWrapper(Longform)
