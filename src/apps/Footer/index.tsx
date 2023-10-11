import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import { FooterData, EpisodeData } from '../types'
import Carousel from '../components/Carousel'
import styles from './styles.module.scss'

interface Props extends InjectedProps { }
interface State { }

class Footer extends Component<Props, State> {

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render(): JSX.Element {
    const { props } = this

    const generalData = props.sheetBase?.collection('footer_data').value[0] as unknown as FooterData;
    const episodesData = props.sheetBase?.collection('thumbnails_data').value ?? [] as unknown as EpisodeData[];

    const customCss = generalData.styles?.trim()
      .replace(/\s+/igm, ' ')
      .replace(/\n/igm, ' ')

    const footerClass = `outoc-footer-app`
    const footerClasses = [`${footerClass}`, styles['footer']]
    const headerClasses = [`${footerClass}__header`, styles['header']]

    return <div className={footerClasses.join(' ')}>

      <style>{customCss}</style>

      <div className={headerClasses.join(' ')}>
        {generalData.header}
      </div>

      <Carousel episodes={episodesData as EpisodeData[]} />
    </div>
  }
}

export type { Props, Footer }
export default appWrapper(Footer)
