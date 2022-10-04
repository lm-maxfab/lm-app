import { Component } from 'preact'
import bem from '../../../modules/utils/bem'
import './styles.scss'

export const className = bem('metoo-bg-slot')

export default class BackgroundSlot extends Component<{}, {}> {
  render () {
    return <div className={className.value}>
      <div className={className.elt('content-slot').value}>
        {this.props.children}
      </div>
    </div>
  }
}
