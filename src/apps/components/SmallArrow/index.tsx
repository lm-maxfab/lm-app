import { Component } from 'preact'

interface Props {
}

export default class Arrow extends Component<Props> {
  render(props: Props): JSX.Element {
    return <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M0.083374 1.74218L1.36723 0.458328L7.7865 6.8776L1.36723 13.2969L0.083374 12.013L5.17867 6.8776L0.083374 1.74218Z" />
    </svg>
  }
}
