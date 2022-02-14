import { Component, JSX } from 'preact'
import Sequencer from '../../../modules/le-monde/components/Sequencer'
import bem from '../../../modules/le-monde/utils/bem'
import { IntroImageData } from '../../types'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  images?: IntroImageData[]
}

class ImageFlipper extends Component<Props, {}> {
  static clss = 'covid-image-flipper'
  clss = ImageFlipper.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Classes and style */
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }
    
    console.log(props.images)

    /* Display */
    return (
      <div className={wrapperClasses.value} style={wrapperStyle}>
        <Sequencer
          play
          tempo={64}
          sequence={['img-1', 'img-2', 'img-3', 'img-4']}
          renderer={({ step, value }) => <div>{step}: {value}</div>} />
      </div>
    )
  }
}

export type { Props }
export default ImageFlipper
