import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import { GeneralData } from '../types'
import './styles.scss'
import InfoText from '../components/InfoText'

interface Props extends InjectedProps { }
interface State { }

class Links extends Component<Props, State> {
  static clss: string = 'mondial-links'
  clss = Links.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render(): JSX.Element {
    const { props } = this

    const generalData = props.sheetBase?.collection('general').value[0] as unknown as GeneralData

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
      <InfoText content={generalData.infoText} />
    </div>
  }
}

export type { Props, Links }
export default appWrapper(Links)
