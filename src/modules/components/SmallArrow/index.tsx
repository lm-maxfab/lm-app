import { Component } from 'preact'

interface Props {
  pointing?: 'top' | 'right' | 'bottom' | 'left'
}

export default class Arrow extends Component<Props> {
  render(props: Props): JSX.Element {
    let rotate = 0

    if (props.pointing === 'top') rotate = 180
    if (props.pointing === 'right') rotate = -90
    if (props.pointing === 'left') rotate = 90

    const inlineStyle = `transform: rotate(${rotate}deg);`

    return <svg style={inlineStyle} width="8" height="12" viewBox="0 0 8 12" fill="none" >
      <path d="M3.64645 11.8536C3.84171 12.0488 4.15829 12.0488 4.35355 11.8536L7.53553 8.67157C7.7308 8.47631 7.7308 8.15973 7.53553 7.96447C7.34027 7.7692 7.02369 7.7692 6.82843 7.96447L4 10.7929L1.17157 7.96447C0.97631 7.7692 0.659728 7.7692 0.464466 7.96447C0.269204 8.15973 0.269204 8.47631 0.464466 8.67157L3.64645 11.8536ZM3.5 0.5L3.5 11.5L4.5 11.5L4.5 0.5L3.5 0.5Z" />
    </svg>
  }
}
