import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import { TeamData } from '../types'
import Gradient from '../components/Gradient'
import Circle from '../components/Circle'
import './styles.scss'

import getConfig from '../../modules/utils/get-config'

const config = getConfig()

interface Props extends InjectedProps { }
interface State { }

const appIdNode = document.querySelector('.lm-app-id') as HTMLElement
const appId = appIdNode?.innerText

class Cover extends Component<Props, State> {
  static clss: string = 'mondial-cover'
  clss = Cover.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render(): JSX.Element {
    const { props } = this

    const teamsData = ((props.sheetBase?.collection('teams').value ?? []) as unknown as TeamData[])
    const coverTeam = teamsData.find(team => team.iso === appId.toLowerCase())

    const isInApp = window.location.href.match(/apps.([a-z]+\-)?lemonde.(fr|io)/)

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss).mod({
      'in-app': isInApp,
    })

    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      ['--mondial-main-color']: '#3E001F',
    }

    const className = bem(this.clss);

    const imgPlayer = `https://assets-decodeurs.lemonde.fr/redacweb/51-2309-mondial-rugby/player-${coverTeam?.iso}.png`

    // Display    
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>

      <div className={className.elt('circle').value}>
        <Circle></Circle>
      </div>

      <div className={className.elt('gradient').value}>
        <Gradient></Gradient>
        <div className={className.elt('circle').mod('overlay').value}>
          <Circle></Circle>
        </div>
      </div>

      <img className={className.elt('player').value} src={imgPlayer}></img>
    </div>
  }
}

export type { Props, Cover }
export default appWrapper(Cover)
