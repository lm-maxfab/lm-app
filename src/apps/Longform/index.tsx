import { Component, JSX } from 'preact'
import wrapper, { InjectedProps } from '../../wrapper'
import bem from '../../modules/le-monde/utils/bem'
import './styles.scss'

interface Props extends InjectedProps {}

class Longform extends Component<Props, {}> {
  static clss: string = 'prn-longform'
  clss = Longform.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    // Logic
    const sheetBase = props.sheetBase
    const viewportDimensions = props.viewportDimensions
    console.log(sheetBase)
    console.log(viewportDimensions)

    // Assign classes
    const wrapperClasses = bem(props.className ?? '').block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    // Display
    return (
      <div
        style={wrapperStyle}
        className={wrapperClasses.value}>
        Longform.
      </div>
    )
  }
}

export type { Props, Longform }
export default wrapper(Longform)
