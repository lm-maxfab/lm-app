import { Component } from 'preact'
import bem from '../../../modules/utils/bem'
import './styles.scss'

type Props = {
}

type State = {
}

interface GroupBlock {
  randomAngle?: number
}

export const className = bem('mondial-gradient')

class GroupBlock extends Component<Props, State> {

  componentWillMount(): void {
    this.randomAngle = Math.random() * 360;
  }

  render() {
    const inlineStyle = [
      `--mondial-random-angle: ${this.randomAngle}deg;`
    ]

    return <div className={className.value}>
      <div style={inlineStyle.join(' ')} className={className.elt('background').value}></div>
      <div className={className.elt('grain').value}></div>
    </div>
  }
}

export default GroupBlock