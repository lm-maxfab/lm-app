import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import GroupBlock from '../components/Group/GroupBlock'
import Marker from '../components/Marker'
import Burger from '../components/Icons/Burger'
import Close from '../components/Icons/Close'
import { TeamData, GeneralData } from '../types'
import './styles.scss'
import InfoText from '../components/InfoText'

interface Props extends InjectedProps { }
interface State {
  open?: boolean
}

class Header extends Component<Props, State> {
  static clss: string = 'mondial-header'
  clss = Header.clss
  state: State = {
    open: false,
  }

  constructor(props: Props) {
    super(props)
    this.toggleMenu = this.toggleMenu.bind(this)
  }

  toggleMenu() {
    this.setState(curr => ({
      ...curr,
      open: !curr.open
    }))
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render(): JSX.Element {
    const { props } = this

    const generalData = props.sheetBase?.collection('general').value[0] as unknown as GeneralData;

    const teamsData = ((props.sheetBase?.collection('teams').value ?? []) as unknown as TeamData[])

    const groups: string[] = teamsData.map(el => el.group!)
    const groupsData: string[] = groups.filter((el, index) => groups.indexOf(el) === index)

    const isInApp = window.location.href.match(/apps.([a-z]+\-)?lemonde.(fr|io)/)

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss).mod({
      'open': this.state.open,
      'in-app': isInApp,
    })

    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      ['--c-mondial-blue']: '#071080',
      ['--c-mondial-green']: '#00A259',
    }

    const className = bem(this.clss)

    // Display
    return < div
      style={wrapperStyle}
      className={wrapperClasses.value} >

      <div className={className.elt('top').value}>

        <a href={generalData.markerURL} className={className.elt('marker').value}>
          <Marker color='#fff'></Marker>
        </a>

        <div onClick={this.toggleMenu} className={className.elt('burger').value}>
          {this.state.open
            ? <Close></Close>
            : <Burger></Burger>}
          <p>Les équipes</p>
        </div>

      </div>

      <div className={className.elt('scrollable').value}>

        <div className={className.elt('groups').value}>

          {groupsData?.map(group => {
            return <GroupBlock
              nav
              group={group}
              groupTitle={generalData.groupTitle ?? 'Poule'}
              teams={teamsData.filter(el => el.group === group)}
            />
          })}

        </div>

        <InfoText content={generalData.infoText} />

      </div>


    </div >
  }
}

export type { Props, Header }
export default appWrapper(Header)
