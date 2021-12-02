import { Component, JSX, VNode } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'
import { Destination as DestinationType } from '../../types'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  data: DestinationType
}

class Destination extends Component<Props, {}> {
  clss = 'dest22-destination'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this
    const { data } = props

    /* Classes and style */
    const wrapperClasses = bem(props.className ?? '').block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    /* Display */
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      {data.title}
    </div>
  }
}

export type { Props }
export default Destination
