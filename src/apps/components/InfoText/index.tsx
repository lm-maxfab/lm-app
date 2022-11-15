import { Component, VNode } from 'preact'
import bem from '../../../modules/utils/bem'
import './styles.scss'

import getConfig from '../../../modules/utils/get-config'

const config = getConfig()

type Props = {
  content?: VNode | string,
}

type State = {
}

export const className = bem('mondial-info')

export default class Flag extends Component<Props, State> {
  render () {
    return <div className={className.value}>
      {this.props.content}
    </div>
  }
}
