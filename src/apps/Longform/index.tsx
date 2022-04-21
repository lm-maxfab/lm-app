import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import ImageFader from '../../modules/components/ImageFader'
import Paginator from '../../modules/components/Paginator'
import TextBlock from '../components/TextBlock'
import { PageData } from '../types'
import './styles.scss'

interface Props extends InjectedProps {}
interface State {
  currentPageData?: PageData
}

class Longform extends Component<Props, State> {
  static clss: string = 'carnet-de-campagne-longform'
  clss = Longform.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props, state } = this

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    const pagesData = (props.sheetBase?.collection('pages').value ?? []) as unknown as PageData[]
    const mobileImages = pagesData.map(pageData => pageData.mobile_image_url).filter(e => e !== undefined) as string[]
    const desktopImages = pagesData.map(pageData => pageData.desktop_image_url).filter(e => e !== undefined) as string[]
    const imagesToPreload = window.innerWidth > 800 ? desktopImages : mobileImages

    const currentImage = window.innerWidth > 800
      ? state.currentPageData?.desktop_image_url
      : state.currentPageData?.mobile_image_url

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
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
                  content={pageData.text_block_content} />
              </div>
            </Paginator.Page>
          })}
        </Paginator>
      </div>
    </div>
  }
}

export type { Props, Longform }
export default appWrapper(Longform)
