import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import { TeamData } from '../types'
import Gradient from '../components/Gradient'
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
      ['--c-mondial-blue']: '#071080',
      ['--c-mondial-green']: '#00A259',
    }

    const className = bem(this.clss);

    const playerSrc = `https://assets-decodeurs.lemonde.fr/redacweb/51-2309-mondial-rugby/player-${coverTeam?.iso}.png`
    const shapeSrc = `https://assets-decodeurs.lemonde.fr/redacweb/51-2309-mondial-rugby/shape-cover.svg`

    // Display    
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>

      <img
        src={shapeSrc}
        className={className.elt('shape').value} />

      <div className={className.elt('gradient').value}>
        <Gradient></Gradient>
      </div>

      <img className={className.elt('player').value} src={playerSrc}></img>
    </div>
  }
}

export type { Props, Cover }
export default appWrapper(Cover)
