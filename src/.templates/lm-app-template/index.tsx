import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/le-monde/utils/lm-app-wrapper-HOC'
import bem from '../../modules/le-monde/utils/bem'

import './styles.scss'

interface Props extends InjectedProps {}
interface State {}

class LMAppTemplate extends Component<Props, State> {
  static clss: string = 'lm-app-template'
  clss = LMAppTemplate.clss
  state: State = {}

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
  }

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
      LMApp template.
    </div>
  }
}

export type { Props, LMAppTemplate }
export default appWrapper(LMAppTemplate)
