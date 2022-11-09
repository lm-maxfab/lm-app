import { Component } from 'preact'
import './styles.scss'

type Props = {
  color?: string,
}

type State = {
}

export default class Arrow extends Component<Props, State> {
  render() {
    const fillColor = this.props.color ?? 'var(--mondial-main-color)'

    return <svg class="mondial-sidenote__arrow" width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle stroke={fillColor} cx="16.5" cy="16.5" r="16" />
      <path fill={fillColor} d="M10.3125 16.2546V17.7767H20.0475L17.589 20.5611L18.5625 21.6562L22.6875 17.0156L18.5625 12.375L17.589 13.4702L20.0475 16.2546H10.3125Z" />
    </svg>
  }
}
