import { Component } from 'preact'
import bem from '../../../modules/utils/bem'
import './styles.scss'

type Props = {
  color?: string,
}

type State = {
}

export const className = bem('mondial-scrollicon')

export default class ScrollIcon extends Component<Props, State> {
  render () {
    const fillColor = this.props.color ?? '#fff'

    return  <svg className={className.value} width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="27" cy="27" r="26" stroke={fillColor} stroke-width="2"/>
      <path d="M40.5 14.9209L26.6447 28.4209L12.7895 14.9209" stroke={fillColor} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M40.5 24.8682L26.6447 38.3682L12.7895 24.8682" stroke={fillColor} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  }
}
