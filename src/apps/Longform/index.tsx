import { Component, JSX } from 'preact'
import GuideCover from '../components/GuideCover'
import GroupBlock from '../components/Group/GroupBlock'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import { TeamData, GeneralData } from '../types'
import './styles.scss'

interface Props extends InjectedProps {}
interface State {}

class Longform extends Component<Props, State> {
  static clss: string = 'mondial-longform'
  clss = Longform.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    const generalData = props.sheetBase?.collection('general').value[0] as unknown as GeneralData;

    const teamsData = ((props.sheetBase?.collection('teams').value ?? []) as unknown as TeamData[])
    
    const groups: string[] = teamsData.map(el => el.group!)
    const groupsData: string[] = groups.filter((el, index) => groups.indexOf(el) === index)

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      ['--mondial-main-color']: '#3E001F',
    }

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>

        <GuideCover
          title={generalData.title}
          intro={generalData.intro}
        ></GuideCover>

        {groupsData?.map(group => {
          return <GroupBlock
            group={group}
            teams={teamsData.filter(el => el.group === group)}
          />
        })}

    </div>
  }
}

export type { Props, Longform }
export default appWrapper(Longform)
