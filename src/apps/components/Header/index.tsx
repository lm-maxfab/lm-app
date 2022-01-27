import { Component, JSX } from 'preact'
import Svg from '../../../modules/le-monde/components/Svg'
import bem from '../../../modules/le-monde/utils/bem'
import logoUrl from './logo.svg'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
}

class Header extends Component<Props, {}> {
  static clss = 'illus21-header'
  clss = Header.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Classes and style */
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    /* Display */
    return (
      <div className={wrapperClasses.value} style={wrapperStyle}>
        <Svg src={logoUrl} />
      </div>
    )
  }
}

export type { Props }
export default Header
