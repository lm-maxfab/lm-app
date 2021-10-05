import { Component, JSX } from 'preact'

interface Props {
  begin?: number|'beginning'
  end?: number|'end'
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
