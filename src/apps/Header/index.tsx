import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import './styles.scss'
import Scrollator, { ScrollatorPageData } from '../../modules/layouts/Scrollator'
import getPageId from '../../modules/utils/get-page-id'

type TargetedScrollatorPageData = ScrollatorPageData & { target_article_id: string }

interface Props extends InjectedProps {}

class Header extends Component<Props, {}> {
  static clss: string = 'sable-header'
  clss = Header.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    
    const { props } = this
    const allHeaderPagesData = props.sheetBase?.collection('article-cover-pages').value as unknown as TargetedScrollatorPageData[]
    const currentArticleId = getPageId()
    const headerPagesData = allHeaderPagesData.filter(pageData => pageData.target_article_id === currentArticleId)

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      <Scrollator
        fixedBlocksPanelHeight='100vh'
        pagesData={headerPagesData} />
    </div>
  }
}

export type { Props, Header }
export default appWrapper(Header)
