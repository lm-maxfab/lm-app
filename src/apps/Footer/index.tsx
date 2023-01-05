import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import { GeneralData, EpisodeData } from '../types'
import './styles.scss'

import getConfig from '../../modules/utils/get-config'
import Episode from '../components/Episode'

const config = getConfig()

interface Props extends InjectedProps { }
interface State { }

class Footer extends Component<Props, State> {
  static clss: string = 'crim-footer'
  clss = Footer.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render(): JSX.Element {
    const { props } = this

    const generalData = props.sheetBase?.collection('general').value[0] as unknown as GeneralData;
    const episodesData = props.sheetBase?.collection('episodes').value ?? [] as unknown as EpisodeData[];

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
    }

    const className = bem(this.clss)

    // Display

    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>

      <h3>{generalData.title}</h3>
      <p>{generalData.chapo}</p>

      {episodesData.map((episode) => {
        return <Episode episode={episode} />
      })}
    </div>

  }
}

export type { Props, Footer }
export default appWrapper(Footer)
