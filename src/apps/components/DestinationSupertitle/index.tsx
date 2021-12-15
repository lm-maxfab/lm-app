import { Component, JSX } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'
import { Destination as DestinationType } from '../../types'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  textColor: DestinationType['contrast_color']
  content: DestinationType['supertitle']
}

class DestinationSupertitle extends Component<Props, {}> {
  clss = 'dest22-destination-supertitle'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Classes and style */
    const wrapperClasses = bem(props.className ?? '').block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      ['--c-text-color']: props.textColor
    }

    /* Display */
    return (
      <div className={wrapperClasses.value} style={wrapperStyle}>
        {props.content}
      </div>
    )
  }
}

export type { Props }
export default DestinationSupertitle
