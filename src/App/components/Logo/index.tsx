import { Component, JSX } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'
import Svg from '../../../modules/le-monde/components/Svg'
import logoUrl from './logo.svg'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  fill1?: string
  fill2?: string
  fillTransitionTime?: string
}

class Logo extends Component<Props, {}> {
  clss = 'photos22-logo'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Classes and style */
    const wrapperClasses = bem(props.className ?? '').block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      '--fill-1': props.fill1 ?? 'var(--c-main-text)',
      '--fill-2': props.fill2 ?? 'rgb(255, 255, 255, .6)',
      '--fill-transition-time': props.fillTransitionTime ?? '600ms'
    }

    /* Display */
    return (
      <div className={wrapperClasses.value} style={wrapperStyle}>
        <a href='https://lemonde.fr'>
          <Svg
            src={logoUrl}
            className={bem(this.clss).elt('svg').value} />
        </a>
      </div>
    )
  }
}

export type { Props }
export default Logo
