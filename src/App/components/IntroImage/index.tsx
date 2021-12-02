import { Component, JSX } from 'preact'
import Img from '../../../modules/le-monde/components/Img'
import bem from '../../../modules/le-monde/utils/bem'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  url: string
}

class IntroImage extends Component<Props, {}> {
  clss = 'dest22-intro-image'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Classes and style */
    const wrapperClasses = bem(props.className ?? '').block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    /* Display */
    return <Img
      src={props.url}
      style={wrapperStyle}
      className={wrapperClasses.value} />
  }
}

export type { Props }
export default IntroImage
