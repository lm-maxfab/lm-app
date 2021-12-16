import { Component, JSX } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'
import './styles.scss'
import introImageUrl from './assets/intro-image.jpg'
import introSvgUrl from './assets/intro-svg.svg'
import Img from '../../../modules/le-monde/components/Img'
import Svg from '../../../modules/le-monde/components/Svg'

interface Props {
  className?: string
  style?: JSX.CSSProperties
}

class Intro extends Component<Props, {}> {
  clss: string = 'dest22-home'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this
    const wrapperClasses = bem(props.className ?? '').block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    return (
      <div
        className={wrapperClasses.value}
        style={wrapperStyle}>
        <div className={bem(this.clss).elt('inner').value}>
          <Img
            loading='eager'
            src={introImageUrl}
            alt='Où partir en 2022 ? Les 20 destinations du « Monde »' />
          <Svg src={introSvgUrl} />
        </div>
      </div>
    )
  }
}

export type { Props }
export default Intro
