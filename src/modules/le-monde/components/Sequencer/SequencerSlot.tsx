import { Component, JSX, VNode } from 'preact'

interface Props {
  className?: string
  from?: number
  to?: number
  children?: VNode
}

class SequencerSlot extends Component<Props, {}> {
  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this
    return <>{props.children ?? null}</>
  }
}

export type { Props }
export default SequencerSlot
