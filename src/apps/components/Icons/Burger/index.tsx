import { Component } from 'preact'
import bem from '../../../../modules/utils/bem'
import './styles.scss'

type Props = {
  color?: string,
}

type State = {
}

export const className = bem('mondial-burgericon')

export default class Burger extends Component<Props, State> {
  render () {
    const fillColor = this.props.color ?? '#fff'

    return <svg className={className.value} width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="0.5" y1="0.5" x2="13.5" y2="0.5" stroke={fillColor} stroke-linecap="round"/>
      <line x1="0.5" y1="4.5" x2="13.5" y2="4.5" stroke={fillColor} stroke-linecap="round"/>
      <line x1="0.5" y1="8.5" x2="13.5" y2="8.5" stroke={fillColor} stroke-linecap="round"/>
      <line x1="0.5" y1="12.5" x2="13.5" y2="12.5" stroke={fillColor} stroke-linecap="round"/>
    </svg>
    
  }
}
