import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import Marker from '../components/Marker'
import Arrow from '../components/Icons/Arrow'
import bem from '../../modules/utils/bem'
import { GeneralData } from '../types'
import './styles.scss'

interface Props extends InjectedProps {}
interface State {}

class SideNote extends Component<Props, State> {
  static clss: string = 'mondial-sidenote'
  clss = SideNote.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    const generalData = ((props.sheetBase?.collection('general').value ?? []) as unknown as GeneralData[])
    const sideNoteText = generalData[0]?.sidenote
    
    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
    }

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>

      <Marker width='93' color='#fff'></Marker>

      <span>{sideNoteText ?? 'Quelles sont les équipes de la coupe du monde ?'}</span>

      <Arrow color='#fff'></Arrow>
      
    </div>
  }
}

export type { Props, SideNote }
export default appWrapper(SideNote)
