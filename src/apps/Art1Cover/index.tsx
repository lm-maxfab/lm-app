import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import Backbone from '../Backbone'
import './styles.scss'

interface Props extends InjectedProps {}

class Art1Cover extends Component<Props, {}> {
  static clss: string = 'xjg-files-art-1-cover'
  clss = Art1Cover.clss

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
        slotName='art_1_cover'
        sheetBase={props.sheetBase} />
    </div>
  }
}

export type { Props, Art1Cover }
export default appWrapper(Art1Cover)
