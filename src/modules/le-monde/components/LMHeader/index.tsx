import { Component, JSX } from 'preact'
import bem from '../../utils/bem'
import Svg from '../Svg'
import logoUrl from './logo.svg'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
}

class LMHeader extends Component<Props, {}> {
  static clss = 'lm-header'
  clss = LMHeader.clss

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
        <a href='https://lemonde.fr'>
          <Svg
            src={logoUrl}
            className={bem(this.clss).elt('logo').value} />
        </a>
      </div>
    )
  }
}

export type { Props }
export default LMHeader
