import { Component } from 'preact'
import styles from './styles.module.scss'

type LayoutName = 'left-half'|'right-half'
type TransitionName = 'whirl'|'grow'
type TransitionDescriptor = [TransitionName]|[TransitionName, number|string]

type PropsBlockData = {
  id?: string
  depth?: 'scroll'|'back'|'front'
  zIndex?: number
  type?: 'html'|'module'
  content?: string
  layout?: LayoutName
  mobileLayout?: LayoutName
  transitions?: TransitionDescriptor[]
  mobileTransitions?: TransitionDescriptor[]
}

export type PropsPageData = {
  bgColor?: JSX.CSSProperties['backgroundColor']
  blocks?: PropsBlockData[]
}

type Props = {
  thresholdOffset?: string
  bgColorTransitionDuration?: string|number
  pages?: PropsPageData[]
}

type BlockDisplayZone = number[]

type BlockContext = {
  width: number|null
  height: number|null
  page: number|null
  progression: number|null
  pageProgression: number|null
}

type BlockIdentifier = string|PropsBlockData

type StateBlockData = PropsBlockData & {
  _zIndex: number,
  _displayZones: BlockDisplayZone[],
  _context: BlockContext
  _pContext: BlockContext
}

type StatePageData = PropsPageData & {
  _blocksIds: Set<string>
}

type State = {
  pages: Map<number, StatePageData>,
  blocks: Map<BlockIdentifier, StateBlockData>,
  prevProps?: Props
}

/* Actual Component */
export default class Scrollgneugneu extends Component<Props, State> {
  state: State = {
    pages: new Map(),
    blocks: new Map()
  }
  
  static getDerivedStateFromProps (props: Props, state: State): State|null {
    const { prevProps } = state
    if (props.pages === prevProps?.pages) return null

    props.pages?.forEach(propPageData => {
      const propBlocks = propPageData.blocks
      propBlocks?.forEach(propBlockData => {
        console.log(propBlockData)
      })
    })

    const newState = {
      ...state
    }
    return newState
  }

  static getPropBlockIdentifier (blockData: PropsBlockData) {
    return blockData.id ?? blockData
  }
  

  /* * * * * * * * * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * * * * * * * * */
  render () {
    return <div>I am the new scrllgngn</div>
  }
}
