import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import './styles.scss'

interface Props extends InjectedProps {}

class Test extends Component<Props> {
  render (): JSX.Element {
    // Display
    return <div style={{ paddingTop: '100px' }}>
      TEST.
    </div>
  }
}

export type { Props, Test }
export default appWrapper(Test)
