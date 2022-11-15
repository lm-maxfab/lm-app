import { Component, VNode } from 'preact'
import bem from '../../../modules/utils/bem'
import './styles.scss'

type Props = {
  content?: VNode | string
}

type State = {}

export const className = bem('mondial-info')

export default class Flag extends Component<Props, State> {
  render () {
    return <div className={className.value}>
      {this.props.content}
    </div>
  }
}
