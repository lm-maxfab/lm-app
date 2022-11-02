import { Component } from 'preact'
import bem from '../../../modules/utils/bem'
import './styles.scss'

type Props = {
}

type State = {
}

export const className = bem('mondial-gradient')

export default class GroupBlock extends Component<Props, State> {
  render () {
    return <div className={className.value}>
    </div>
  }
}
