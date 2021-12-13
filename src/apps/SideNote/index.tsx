import { Component, JSX } from 'preact'
import bem from '../../modules/le-monde/utils/bem'
import wrapper, { InjectedProps } from '../../wrapper'
import { SideNoteData } from '../types'
import './styles.scss'

interface Props extends InjectedProps {}

class SideNote extends Component<Props, {}> {
  static clss = 'prn-side-note'
  clss = SideNote.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Logic */
    const sideNoteData = props.sheetBase
      .collection('side_note_elements')
      .entries[0]
      .value as unknown as SideNoteData

    /* Classes and style */
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    /* Display */
    return (
      <div
        style={wrapperStyle}
        className={wrapperClasses.value}>
        <h4>{sideNoteData.title}</h4>
        <p>{sideNoteData.paragraph}</p>
      </div>
    )
  }
}

export type { Props }
export default wrapper(SideNote)
