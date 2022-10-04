import { Component } from 'preact'

type Props = {
  color?: string
}

export default class Separator extends Component<Props, {}> {
  render () {
    return <div style={{
      width: '100%',
      height: '1px',
      backgroundColor: this.props.color ?? 'black'
    }} />
  }
}
