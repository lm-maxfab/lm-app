import { Component, JSX } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'

import './styles.scss'
import arrowUrl from './arrow.svg'
import Svg from '../../../modules/le-monde/components/Svg'

interface Props {
  className?: string
  style?: JSX.CSSProperties
}

class ArrowButton extends Component<Props, {}> {
  static clss = 'covid-arrow-button'
  clss = ArrowButton.clss

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
      <button
        style={wrapperStyle}
        className={wrapperClasses.value}>
        <Svg src={arrowUrl} />
      </button>
    )
  }
}

export type { Props }
export default ArrowButton
