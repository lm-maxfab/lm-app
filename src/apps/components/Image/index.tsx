import { Component, JSX } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  url?: string
}

class Image extends Component<Props, {}> {
  static clss = 'illus21-image'
  clss = Image.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Classes and style */
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    /* Display */
    return <img
      src={props.url}
      className={wrapperClasses.value}
      style={wrapperStyle} />
  }
}

export type { Props }
export default Image
