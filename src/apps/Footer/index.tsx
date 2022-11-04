import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import Marker from '../components/Marker'
import Gradient from '../components/Gradient'
import Circle from '../components/Circle'
import Button from '../components/Button'
import { FooterData } from '../types'
import './styles.scss'

import getConfig from '../../modules/utils/get-config'

const config = getConfig()

interface Props extends InjectedProps { }
interface State { }

class Footer extends Component<Props, State> {
  static clss: string = 'mondial-footer'
  clss = Footer.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render(): JSX.Element {
    const { props } = this

    const footerData = props.sheetBase?.collection('footer').value[0] as unknown as FooterData;

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      ['--mondial-main-color']: '#3E001F',
    }

    const className = bem(this.clss)

    // const imgCircle = `${config?.assets_root_url}/circle.svg`
    const imgPlayer1 = `${config?.assets_root_url}/cover-1.png`

    // Display
    // return <div></div>

    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>

      <a href={footerData.url}>

        <div className={className.elt('marker').value}>
          <Marker></Marker>
        </div>

        <p className={className.elt('title').value}>{footerData.title}</p>

        <div className={className.elt('container').value}>

          <div className={className.elt('circle').value}>
            <Circle></Circle>
          </div>

          <div className={className.elt('gradient').value}>
            <Gradient></Gradient>
            <div className={className.elt('circle').mod('overlay').value}>
              <Circle></Circle>
            </div>
          </div>

          <div className={className.elt('players').value}>
            <img src={imgPlayer1} alt="" />
            <img src={imgPlayer1} alt="" />
            <img src={imgPlayer1} alt="" />
            <img src={imgPlayer1} alt="" />
          </div>

          <Button light>{footerData.cta}</Button>
        </div>

      </a>
    </div>
  }
}

export type { Props, Footer }
export default appWrapper(Footer)
