import { Component, JSX, VNode } from 'preact'
import clss from 'classnames'
import Svg from '../../../modules/le-monde/components/Svg'
import lmLogoPath from './assets/logo-le-monde.svg'
import marqueurPath from './assets/marqueur.svg'
import burgerIconLgPath from './assets/burger-icon-lg.svg'
import burgerIconSmPath from './assets/burger-icon-sm.svg'
import './styles.css'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  theme?: 'bright'|'dark'
  noLogo?: boolean
  onButtonClick?: () => void
  linkOnMarqueur?: string
  showButton?: boolean
  buttonDesktopText?: VNode
  buttonMobileText?: VNode
}

class Header extends Component<Props, {}> {
  mainClass: string = 'frag-header'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    // Classes
    const themeClass = props.theme === 'bright' ? `${this.mainClass}_bright` : `${this.mainClass}_dark`
    const logoClass = props.noLogo === true ? `${this.mainClass}_no-logo` : `${this.mainClass}_with-logo`
    const classes: string = clss(this.mainClass, themeClass, logoClass, props.className)
    const inlineStyle = { ...props.style }

    // Display
    return (
      <div className={classes} style={inlineStyle}>
        {/* Logo */}
        {props.noLogo !== true && <a href='https://www.lemonde.fr/'>
          <Svg src={lmLogoPath} className={`${this.mainClass}__logo`} />
        </a>}
        {/* Marqueur */}
        {props.linkOnMarqueur !== undefined
          ? <a href={props.linkOnMarqueur}><Svg src={marqueurPath} className={`${this.mainClass}__marqueur`} /></a>
          : <Svg src={marqueurPath} className={`${this.mainClass}__marqueur`} />}
        {/* Button */}
        {props.showButton === true
          ? <>
            <button
              onClick={() => (props.onButtonClick !== undefined && props.onButtonClick())}
              className={`${this.mainClass}__button ${this.mainClass}__button_lg`}>
              <span className={`${this.mainClass}__button-text`}>{props.buttonDesktopText}&nbsp;</span>
              <Svg src={burgerIconLgPath} />
            </button>
            <button
              onClick={() => (props.onButtonClick !== undefined && props.onButtonClick())}
              className={`${this.mainClass}__button ${this.mainClass}__button_sm`}>
              <span className={`${this.mainClass}__button-text`}>{props.buttonMobileText}&nbsp;</span>
              <Svg src={burgerIconSmPath} />
            </button>
          </>
          : <></>}
      </div>
    )
  }
}

export type { Props }
export default Header
