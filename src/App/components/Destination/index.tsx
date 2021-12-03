import { Component, JSX, VNode } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'
import { Destination as DestinationType } from '../../types'
import DestinationHead from '../DestinationHead'
import DestinationContent from '../DestinationContent'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  data: DestinationType
  position: number
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
    const wrapperStyle: JSX.CSSProperties = {
      ['--c-content-bg']: data.main_color ?? 'inherit',
      ['--c-main-text']: data.contrast_color ?? 'inherit',
      ...props.style
    }

    /* Display */
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      <div className={bem(this.clss).elt('head').value}>
        <DestinationHead
          data={data}
          fixedImage={true}
          position={props.position} />
      </div>
      <div className={bem(this.clss).elt('content').value}>
        <DestinationContent content={data.content} />
      </div>
    </div>
  }
}

export type { Props }
export default Destination
