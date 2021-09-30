import { Component, JSX } from 'preact'
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
    const classes: string = clss(this.mainClass, themeClass, props.className)
    const inlineStyle = { ...props.style }

    // Display
    return (
      <div className={classes} style={inlineStyle}>
        <Svg
          src={lmLogoPath}
          className={`${this.mainClass}__logo`} />
        <Svg
          src={marqueurPath}
          className={`${this.mainClass}__marqueur`} />
        <button
          className={`${this.mainClass}__button ${this.mainClass}__button_sm`}>
          <span className={`${this.mainClass}__button-text`}>
            Voir les 100 reportages&nbsp;
          </span>
          <Svg src={burgerIconSmPath} />
        </button>
        <button
          className={`${this.mainClass}__button ${this.mainClass}__button_lg`}>
          <span className={`${this.mainClass}__button-text`}>
            Voir les 100 reportages&nbsp;
          </span>
          <Svg src={burgerIconLgPath} />
        </button>
      </div>
    )
  }
}

export type { Props }
export default Header
