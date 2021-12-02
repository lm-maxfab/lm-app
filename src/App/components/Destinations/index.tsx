import { Component, JSX, VNode } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'
import { Destination as DestinationType } from '../../types'
import Destination from '../Destination'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  entries: DestinationType[]
}

class Destinations extends Component<Props, {}> {
  clss = 'dest22-destinations'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this
    const { entries } = props

    /* Classes and style */
    const wrapperClasses = bem(props.className ?? '').block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    /* Display */
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      {entries.map(entry => {
        return <Destination data={entry} />
      })}
    </div>
  }
}

export type { Props }
export default Destinations
