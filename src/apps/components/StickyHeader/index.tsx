import { Component, JSX } from 'preact'
import Svg from '../../../modules/le-monde/components/Svg'
import bem from '../../../modules/le-monde/utils/bem'
import logoUrl from './assets/logo.svg'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
}

class StickyHeader extends Component<Props, {}> {
  static clss = 'prn-sticky-header'
  clss = StickyHeader.clss

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
        <div className={bem(this.clss).elt('opacifier').value} />
        <a href='https://www.lemonde.fr'><Svg src={logoUrl} /></a>
      </div>
    )
  }
}

export type { Props }
export default StickyHeader
