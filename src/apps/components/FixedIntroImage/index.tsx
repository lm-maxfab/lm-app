import { Component, JSX } from 'preact'
import Img from '../../../modules/le-monde/components/Img'
import bem from '../../../modules/le-monde/utils/bem'
import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  imgUrl?: string
}

class FixedIntroImage extends Component<Props, {}> {
  static clss = 'prn-fixed-intro-image'
  clss = FixedIntroImage.clss

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
      <div
        style={wrapperStyle}
        className={wrapperClasses.value}>
        <Img src={props.imgUrl} />
      </div>
    )
  }
}

export type { Props }
export default FixedIntroImage
