import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import { GeneralData, EpisodeData } from '../types'
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

    const generalData = props.sheetBase?.collection('general').value[0] as unknown as GeneralData;
    const episodesData = props.sheetBase?.collection('episodes').value ?? [] as unknown as EpisodeData[];

    const customCss = generalData.styles?.trim()
      .replace(/\s+/igm, ' ')
      .replace(/\n/igm, ' ')

    return <div className={styles['footer']}>

      <style>{customCss}</style>

      <div className={styles['header']}>
        {generalData.header}
      </div>

      <Carousel episodes={episodesData as EpisodeData[]} />

    </div>
  }
}

export type { Props, Footer }
export default appWrapper(Footer)
