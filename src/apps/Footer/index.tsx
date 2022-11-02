import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import Marker from '../components/Marker'
import Gradient from '../components/Gradient'
import Button from '../components/Button'
import { FooterData } from '../types'
import './styles.scss'

import getConfig from '../../modules/utils/get-config'

const config = getConfig()

interface Props extends InjectedProps {}
interface State {}

class Footer extends Component<Props, State> {
  static clss: string = 'mondial-footer'
  clss = Footer.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    const footerData = props.sheetBase?.collection('footer').value[0] as unknown as FooterData;
    console.log(footerData)

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      ['--mondial-main-color']: '#3E001F',
    }

    const className = bem(this.clss)

    const imgCircle = `${config?.assets_root_url}/circle.svg`
    const imgPlayer1 = `${config?.assets_root_url}/cover-1.png`
    const imgPlayer2 = `${config?.assets_root_url}/cover-2.png`

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>

      <Marker></Marker>
      <p className={className.elt('title').value}>{footerData.title}</p>

      <div className={className.elt('container').value}>
        <img className={className.elt('container').elt('circle').value} src={imgCircle} alt="" />

        <div className={className.elt('container').elt('gradient').value}>
          <Gradient></Gradient>
          <img className={className.elt('container').elt('circle').mod('overlay').value} src={imgCircle} alt="" />
        </div>

        <div className={className.elt('container').elt('players').value}>
          <img src={imgPlayer1} alt="" />
          <img src={imgPlayer1} alt="" />
          <img src={imgPlayer1} alt="" />
          <img src={imgPlayer1} alt="" />
        </div>

        <Button light>{footerData.cta}</Button>
      </div>
    </div>
  }
}

export type { Props, Footer }
export default appWrapper(Footer)
