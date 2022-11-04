import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import GroupBlock from '../components/Group/GroupBlock'
import Marker from '../components/Marker'
import Burger from '../components/Icons/Burger'
import Close from '../components/Icons/Close'
import { TeamData } from '../types'
import './styles.scss'

interface Props extends InjectedProps { }
interface State {
  open?: boolean
}

class Header extends Component<Props, State> {
  static clss: string = 'mondial-header'
  clss = Header.clss
  state: State = {
    open: true,
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

    const teamsData = ((props.sheetBase?.collection('teams').value ?? []) as unknown as TeamData[])

    const groups: string[] = teamsData.map(el => el.group!)
    const groupsData: string[] = groups.filter((el, index) => groups.indexOf(el) === index)

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss).mod({
      'open': this.state.open,
    })

    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      ['--mondial-main-color']: '#3E001F',
    }

    const className = bem(this.clss)

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>

      <div className={className.elt('top').value}>

        <div onClick={this.toggleMenu} className={className.elt('marker').value}>
          <Marker color='#fff'></Marker>
        </div>

        <div onClick={this.toggleMenu} className={className.elt('burger').value}>
          {this.state.open
            ? <Close></Close>
            : <Burger></Burger>}
          <p>Les équipes</p>
        </div>

      </div>

      {this.state.open
        ? <div className={className.elt('groups').value}>

          {groupsData?.map(group => {
            return <GroupBlock
              nav
              group={group}
              teams={teamsData.filter(el => el.group === group)}
            />
          })}

        </div>
        : ''}



    </div>
  }
}

export type { Props, Header }
export default appWrapper(Header)
