import { Component, JSX } from 'preact'
import GuideCover from '../components/GuideCover'
import InfoText from '../components/InfoText'
import GroupBlock from '../components/Group/GroupBlock'
import TeamImage from '../components/Team/TeamImage'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import { TeamData, GeneralData } from '../types'
import './styles.scss'
import ArticleHeader from '../../modules/components/ArticleHeader'
import ArticleCredits from '../../modules/components/ArticleCredits'
import MyComp from '../components/MyComp'

interface Props extends InjectedProps { }
interface State { }

class Longform extends Component<Props, State> {
  static clss: string = 'mondial-longform'
  clss = Longform.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render(): JSX.Element {
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

    const className = bem(this.clss)

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      <div style={{
        position: 'fixed', top: 0, zIndex: 10
      }}><ArticleHeader
          fill1='black'
          fill2='rgb(0,0,0,.3)' /></div>

      <GuideCover
        title={generalData.title}
        intro={generalData.intro}
      ></GuideCover>

      <div className={className.elt('wrapper').value}>
        <InfoText content={generalData.infoText} />

        <div>
          {groupsData?.map(group => {
            return <GroupBlock
              group={group}
              teams={teamsData.filter(el => el.group === group)}
            />
          })}
        </div>

        <div className={className.elt('end').value}>
          <div>
            <p className={className.elt('conclusion').value}>{generalData.conclusion}</p>
            <ArticleCredits
              className={className.elt('credits').value}
              content={generalData.credits}
            ></ArticleCredits>
          </div>
        </div>
      </div>

    </div>
  }
}

export type { Props, Longform }
export default appWrapper(Longform)
