import { Component, JSX } from 'preact'
import Sequencer from '../../../modules/le-monde/components/Sequencer'
import bem from '../../../modules/le-monde/utils/bem'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
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

    /* Display */
    return (
      <div className={wrapperClasses.value} style={wrapperStyle}>
        <Sequencer
          play
          tempo={640}
          sequence={['lil', 'lal', 'loul', 'hihi']}
          renderer={({ step, value }) => <div>{step}: {value}</div>} />
      </div>
    )
  }
}

export type { Props }
export default ImageFlipper
