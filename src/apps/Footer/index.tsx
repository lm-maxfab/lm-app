import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import Marker from '../components/Marker'
import Gradient from '../components/Gradient'
import Button from '../components/Button'
import { FooterData, GeneralData } from '../types'
import './styles.scss'

import getConfig from '../../modules/utils/get-config'
import InfoText from '../components/InfoText'

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

    const generalData = props.sheetBase?.collection('general').value[0] as unknown as GeneralData
    const footerData = props.sheetBase?.collection('footer').value[0] as unknown as FooterData;

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      ['--c-mondial-blue']: '#071080',
      ['--c-mondial-green']: '#00A259',
    }

    const className = bem(this.clss)

    const imgFooter = 'https://assets-decodeurs.lemonde.fr/redacweb/51-2309-mondial-rugby/footer.png'

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>

      <div className={className.elt('container').value}>
        <div className={className.elt('marker').value}>
          <Marker></Marker>
        </div>

        <p className={className.elt('title').value}>{footerData.title}</p>

        <a href={footerData.url} className={className.elt('block').value}>
          <div className={className.elt('gradient').value}>
            <Gradient></Gradient>
          </div>

          <div className={className.elt('image').value}>
            <img src={imgFooter} alt="" />
          </div>

          <div className={className.elt('overlay').value}>
          </div>

          <Button light>{footerData.cta}</Button>
        </a>
      </div>

      <InfoText content={generalData.infoText} />
    </div>

  }
}

export type { Props, Footer }
export default appWrapper(Footer)
