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
    const { sheetBase } = props

    const footerSettings = sheetBase?.collection('footer_settings').entries[0]?.value as FooterData|undefined
    const episodesData = sheetBase?.collection('episodes_data').value as EpisodeData[]|undefined
    const customCss = footerSettings?.styles?.trim()
      .replace(/\s+/igm, ' ')
      .replace(/\n/igm, ' ')

    return <div className={`${props.className} ${styles['footer']}`}>
      <style>{customCss}</style>
      <div className={styles['header']}>{footerSettings?.top_content}</div>
      <Carousel episodes={episodesData as EpisodeData[]} />
    </div>
  }
}

export type { Props, Footer }
export default appWrapper(Footer)
