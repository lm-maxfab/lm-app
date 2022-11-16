import { Component } from 'preact'

type Props = {
  type?: 'module'|'html'
  content?: string
}
type State = {}

export default class BlockRenderer extends Component<Props, State> {
  render () {
    const { props } = this
    switch (props.type) {
      case 'html':
      case undefined:
        return <div dangerouslySetInnerHTML={{ __html: props.content ?? '' }} />
      case 'module':
        return <div>I cannot render modules yet.</div>
      default:
        return <div>Module type {props.type} is unknown</div>
    }
  }
}
