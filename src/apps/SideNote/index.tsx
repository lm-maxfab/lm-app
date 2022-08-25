import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import './styles.scss'
import { SideNoteData } from '../types'

interface Props extends InjectedProps {}

class SideNote extends Component<Props, {}> {
  static clss: string = 'sable-side-note'
  clss = SideNote.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    const sideNoteData = props.sheetBase?.collection('side-note').entries[0].value as unknown as SideNoteData

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      '--bg-color': sideNoteData.bg_color
    }

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      {sideNoteData.title !== undefined && <h3>{sideNoteData.title}</h3>}
      {sideNoteData.content !== undefined && <p>{sideNoteData.content}</p>}
    </div>
  }
}

export type { Props, SideNote }
export default appWrapper(SideNote)
