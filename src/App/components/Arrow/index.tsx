import { Component } from 'preact'

type Props = {
  color?: string,
  direction?: string,
  small?: boolean,
}

type State = {
}

export default class Arrow extends Component<Props, State> {
  render() {
    const fillColor = this.props.color ?? '#635135'
    const transform = `transform: rotate(${this.props.direction === 'left' ? 180 : 0}deg); transform-origin: center;`

    return <svg aria-hidden='true' style={transform} width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill={fillColor} fill-rule="evenodd" clip-rule="evenodd" d="M5.7862 8L0 14.112L1.90939 16L10 8L1.90939 0L0 1.888L5.7862 8Z" />
    </svg>
  }
}
