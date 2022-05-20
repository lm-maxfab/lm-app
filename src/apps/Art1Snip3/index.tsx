import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import Backbone from '../Backbone'
import './styles.scss'

interface Props extends InjectedProps {}

class Art1Snip3 extends Component<Props, {}> {
  static clss: string = 'xjg-files-art-1-snip-3'
  clss = Art1Snip3.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      <Backbone
        slotName='art_1_snip_3'
        sheetBase={props.sheetBase} />
    </div>
  }
}

export type { Props, Art1Snip3 }
export default appWrapper(Art1Snip3)
