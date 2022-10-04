import { Component } from 'preact'
import fakeUuid from '../../utils/fake-uuid'

type Props = {
  min?: number
  max?: number
}

export default class ResponsiveDisplayer extends Component<Props, {}> {
  id: string|null = null
  
  constructor (props: Props) {
    super(props)
    this.id = fakeUuid(8)
  }

  render () {
    const { min, max } = this.props
    return <>
      {this.id !== null && <style>
        {min === undefined ? '' : `@media screen and (max-width: ${min}px) { #${this.id} { display: none; } }`}
        {max === undefined ? '' : `@media screen and (min-width: ${max + 1}px) { #${this.id} { display: none; } }`}
      </style>}
      <span id={this.id ?? ''}>{this.props.children}</span>
    </>
  }
}
