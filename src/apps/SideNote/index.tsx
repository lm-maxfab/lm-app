import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import Gradient from '../components/Gradient'
import Marker from '../components/Marker'
import Arrow from '../components/Icons/Arrow'
import bem from '../../modules/utils/bem'
import { GeneralData } from '../types'
import './styles.scss'

interface Props extends InjectedProps { }
interface State { }

class SideNote extends Component<Props, State> {
  static clss: string = 'mondial-sidenote'
  clss = SideNote.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render(): JSX.Element {
    const { props } = this

    const generalData = ((props.sheetBase?.collection('general').value ?? []) as unknown as GeneralData[])
    const sideNoteText = generalData[0]?.sidenote

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      ['--c-mondial-blue']: '#071080',
      ['--c-mondial-green']: '#00A259',
    }

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>

      <Gradient angle={320}></Gradient>

      <div className={wrapperClasses.elt('content').value}>
        <div className={wrapperClasses.elt('marker').value}>
          <Marker color='#fff'></Marker>
        </div>
        <span>{sideNoteText}</span>
      </div>
    </div>
  }
}

export type { Props, SideNote }
export default appWrapper(SideNote)
