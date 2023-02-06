import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import FooterComponent from '../../modules/components/Footer'
import { Props as FooterProps } from '../../modules/components/Footer'
import { Props as ThumbnailProps } from '../../modules/components/ArticleThumbnail'

interface Props extends InjectedProps { }
interface State { }

class Footer extends Component<Props, State> {

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render(): JSX.Element {
    const { sheetBase } = this.props

    const footerData = sheetBase?.collection('footer_data').entries[0].value as FooterProps
    const thumbnailsData = sheetBase?.collection('thumbnails_data').value as ThumbnailProps[]

    const footerProps = { articleThumbsData: thumbnailsData, ...footerData }

    return <FooterComponent {...footerProps} />
  }
}

export type { Props, Footer }
export default appWrapper(Footer)
