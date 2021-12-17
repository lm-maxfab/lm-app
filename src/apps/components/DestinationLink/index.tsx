import { Component, JSX } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'
import DestinationOpener from '../DestinationOpener'
import { Destination as DestinationType } from '../../types'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  url?: string
  textColor?: DestinationType['contrast_color']
  bgColor?: DestinationType['main_color']
  borderColor?: DestinationType['contrast_color']
}

class DestinationLink extends Component<Props, {}> {
  static clss = 'dest22-destination-link'
  clss = DestinationLink.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Classes and style */
    const wrapperClasses = bem(props.className ?? '').block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      ['--c-underline-color']: props.textColor
    }

    /* Display */
    return (
      <div className={wrapperClasses.value} style={wrapperStyle}>
        <a href={props.url}>Lire la suite du reportage</a>
        <a href={props.url}>
          <DestinationOpener
            bgColor={props.bgColor}
            borderColor={props.borderColor} />
        </a>
      </div>
    )
  }
}

export type { Props }
export default DestinationLink
