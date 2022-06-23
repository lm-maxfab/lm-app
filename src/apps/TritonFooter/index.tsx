import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import './styles.scss'
import { FooterData, FooterThumbData } from '../types'
import ArticleSeriesHighlight from '../../modules/components/ArticleSeriesHighlight'

interface Props extends InjectedProps {}

class Footer extends Component<Props, {}> {
  static clss: string = 'triton-footer'
  clss = Footer.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

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
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      <ArticleSeriesHighlight
        title={footerData.title}
        paragraph={footerData.paragraph}
        buttonContent={footerData.button_text}
        buttonUrl={footerData.button_url}
        buttonOpensNewTab={footerData.button_opens_new_tab}
        thumbsData={footerThumbsData} />
    </div>
  }
}

export type { Props, Footer }
export default appWrapper(Footer)
