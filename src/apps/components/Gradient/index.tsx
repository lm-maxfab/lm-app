import { Component } from 'preact'
import bem from '../../../modules/utils/bem'
import './styles.scss'

type Props = {
}

type State = {
}

interface GroupBlock {
  randomPosX?: string
}

export const className = bem('mondial-gradient')

class GroupBlock extends Component<Props, State> {

  componentWillMount(): void {
    this.randomPosX = Math.random() * 100 + '%';
  }

  render() {
    return <div className={className.value}>
      <div style={{ backgroundPositionX: this.randomPosX }} className={className.elt('background').value}></div>
      <div className={className.elt('grain').value}></div>
    </div>
  }
}

export default GroupBlock