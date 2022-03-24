import { Component, JSX } from 'preact'
import bem from '../../../modules/utils/bem'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  height?: JSX.CSSProperties['height']
}

class Slide extends Component<Props, {}> {
  static clss = 'carto-twitter-slide'
  clss = Slide.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Classes and style */
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      height: props.height ?? '100vh'
    }

    /* Display */
    return (
      <div className={wrapperClasses.value} style={wrapperStyle}>
        {props.children}
      </div>
    )
  }
}

export type { Props }
export default Slide
