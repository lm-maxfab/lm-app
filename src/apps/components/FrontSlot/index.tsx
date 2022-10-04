import { Component } from 'preact'
import bem from '../../../modules/utils/bem'
import './styles.scss'

export const className = bem('metoo-front-slot')

export default class FrontSlot extends Component<{}, {}> {
  render () {
    return <div className={className.value}>
      <div className={className.elt('content').value}>
        {this.props.children}
      </div>
    </div>
  }
}
