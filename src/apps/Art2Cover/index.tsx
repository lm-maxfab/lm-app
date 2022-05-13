import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import Backbone from '../Backbone'
import './styles.scss'

interface Props extends InjectedProps {}

class Art2Cover extends Component<Props, {}> {
  static clss: string = 'xjg-files-art-2-cover'
  clss = Art2Cover.clss

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
        slotName='art_2_cover'
        sheetBase={props.sheetBase} />
    </div>
  }
}

export type { Props, Art2Cover }
export default appWrapper(Art2Cover)
