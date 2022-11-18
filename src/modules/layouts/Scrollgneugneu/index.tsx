import { Component } from 'preact'
import Paginator, { State as PaginatorState } from '../../components/Paginator'
import BlockRenderer from './BlockRenderer'
import styles from './styles.module.scss'

type CommonBlockData = {
  type?: 'module'|'html'
  content?: string
  layout?: string
  mobileLayout?: string
  customLayoutCss?: string
  customMobileLayoutCss?: string
}

type ScrollingBlockData = CommonBlockData & { depth?: 'scroll' }
type FixedBlockData = CommonBlockData & { depth: 'back'|'front', id?: string, zIndex?: number }
type ReferenceBlockData = { id?: string }
type BlockData = ScrollingBlockData|FixedBlockData|ReferenceBlockData

export type PageData = {
  chapterName?: string
  bgColor?: JSX.CSSProperties['backgroundColor']
  data?: any
  blocks?: BlockData[]
}

type ExploitableBlockData = ScrollingBlockData|FixedBlockData
type ExploitableBlockDataWithZIndex = { blockData: ExploitableBlockData, zIndex: number }
type ExploitablePageData = Omit<PageData, 'blocks'> & { blocks?: ExploitableBlockData[] }

type Props = {
  thresholdOffset?: string
  fixedBlocksHeight?: string
  bgColorTransitionDuration?: string|number
  pages?: PageData[]
}

type State = {
  currentPagePos?: number
  previousPagePos?: number
}

export default class Scrollgneugneu extends Component<Props, State> {
  state: State = {}
  constructor (props: Props) {
    super(props)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.getExploitablePages = this.getExploitablePages.bind(this)
    this.getBgColorTransitionDuration = this.getBgColorTransitionDuration.bind(this)
    this.getAllFixedBlocks = this.getAllFixedBlocks.bind(this)
    this.getDedupedFixedBlocks = this.getDedupedFixedBlocks.bind(this)
    this.getZSortedFixedBlocks = this.getZSortedFixedBlocks.bind(this)
    this.getBlockCurrentStatus = this.getBlockCurrentStatus.bind(this)
  }

  handlePageChange (paginatorState: PaginatorState) {
    const { coming, active, passed } = paginatorState
    const pagesLength = active.length + coming.length + passed.length
    const hasPages = pagesLength > 0
    const noneComing = coming.length === 0
    const nonePassed = passed.length === 0
    const noneActive = active.length === 0
    const pages = this.props.pages
    const isBeforeFirst = hasPages && noneActive && nonePassed
    const isAfterLast = hasPages && noneActive && noneComing
    if (isBeforeFirst) return this.setState(curr => ({
      ...curr,
      currentPagePos: pages !== undefined ? 0 : undefined,
      previousPagePos: curr.currentPagePos
    }))
    if (isAfterLast) return this.setState(curr => ({
      ...curr,
      currentPagePos: pages !== undefined ? pages.length - 1 : undefined,
      previousPagePos: curr.currentPagePos
    }))
    this.setState(curr => ({
      ...curr,
      currentPagePos: paginatorState.value as number|undefined,
      previousPageData: curr.currentPagePos
    }))
  }

  getBgColorTransitionDuration (): string {
    const { bgColorTransitionDuration } = this.props
    if (typeof bgColorTransitionDuration === 'number') return `${bgColorTransitionDuration}ms`
    if (typeof bgColorTransitionDuration === 'string') return bgColorTransitionDuration
    return '200ms'
  }

  getExploitablePages (): ExploitablePageData[]|undefined {
    const pagesData = this.props.pages
    if (pagesData === undefined) return
    const blockIdsMap = new Map<string, BlockData>()
    const exploitablePagesData: ExploitablePageData[] = pagesData.map(pageData => {
      const exploitableBlocksData: ExploitableBlockData[]|undefined = pageData.blocks?.map(blockData => {
        const idInBlock = 'id' in blockData
        const hasId = idInBlock && blockData.id !== undefined
        if (!hasId) return blockData as ExploitableBlockData
        const id = blockData.id as string
        const storedBlockData = blockIdsMap.get(id as string)
        if (storedBlockData !== undefined) return storedBlockData as ExploitableBlockData
        blockIdsMap.set(id, blockData)
        return blockData as ExploitableBlockData
      })
      return {
        ...pageData,
        blocks: exploitableBlocksData
      }
    })
    return exploitablePagesData
  }

  getAllFixedBlocks (): ExploitableBlockData[] {
    const { getExploitablePages } = this
    const exploitablePages = getExploitablePages()
    const allFixedBlocks: ExploitableBlockData[] = []
    exploitablePages?.forEach(pageData => {
      pageData.blocks?.forEach(blockData => {
        const isBack = blockData.depth === 'back'
        const isFront = blockData.depth === 'front'
        const isFixed = isBack || isFront
        if (isFixed) allFixedBlocks.push(blockData)
      })
    })
    return allFixedBlocks
  }

  getDedupedFixedBlocks (): ExploitableBlockData[] {
    const { getAllFixedBlocks } = this
    const allFixedBlocks = getAllFixedBlocks()
    const dedupedFixedBlocks: ExploitableBlockData[] = []
    const idsSet = new Set<string>()
    allFixedBlocks.forEach(blockData => {
      const idInBlockData = 'id' in blockData
      if (!idInBlockData) return dedupedFixedBlocks.push(blockData)
      const idIsUndef = blockData.id === undefined
      if (idIsUndef) return dedupedFixedBlocks.push(blockData)
      const id = blockData.id as string // TS should understand this by itself ?
      const alreadyInDeduped = idsSet.has(id as string)
      if (alreadyInDeduped) return
      idsSet.add(id)
      return dedupedFixedBlocks.push(blockData)
    })
    return dedupedFixedBlocks
  }

  getZSortedFixedBlocks (): ExploitableBlockDataWithZIndex[] {
    const { getDedupedFixedBlocks } = this
    const dedupedFixedBlocks = getDedupedFixedBlocks()
    const dedupedBgBlocks = dedupedFixedBlocks.filter(blockData => blockData.depth === 'back')
    const dedupedFgBlocks = dedupedFixedBlocks.filter(blockData => blockData.depth === 'front')
    const blocksSorter = (aBlock: ExploitableBlockData, bBlock: ExploitableBlockData) => {
      const aHasZid = 'zIndex' in aBlock
      const aZid = aHasZid ? (aBlock.zIndex ?? 0) : 0
      const bHasZid = 'zIndex' in bBlock
      const bZid = bHasZid ? (bBlock.zIndex ?? 0) : 0
      return aZid - bZid
    }
    const sortedBgBlocks = dedupedBgBlocks.sort(blocksSorter)
    const sortedFgBlocks = dedupedFgBlocks.sort(blocksSorter)
    const fgBlocksMinZindex = sortedBgBlocks.length + 1
    return [
      ...sortedBgBlocks.map((blockData, blockPos) => ({ blockData, zIndex: blockPos })),
      ...sortedFgBlocks.map((blockData, blockPos) => ({ blockData, zIndex: fgBlocksMinZindex + blockPos }))
    ]
  }

  getBlockCurrentStatus (blockData: ExploitableBlockData): 'current'|'previous'|'inactive' {
    const { state, getExploitablePages } = this
    const pages = getExploitablePages()
    if (pages === undefined) return 'inactive'
    const { currentPagePos, previousPagePos } = state
    const currentPageData = currentPagePos !== undefined
      ? pages[currentPagePos]
      : undefined
    if (currentPageData !== undefined) {
      const currentPageBlocks = currentPageData.blocks
      if (currentPageBlocks !== undefined) {
        const isInCurrentBlocks = currentPageBlocks.includes(blockData)
        if (isInCurrentBlocks) return 'current'
      }
    }
    const previousPageData = previousPagePos !== undefined
      ? pages[previousPagePos]
      : undefined
    if (previousPageData !== undefined) {
      const previousPageBlocks = previousPageData.blocks
      if (previousPageBlocks !== undefined) {
        const isInPreviousBlocks = previousPageBlocks.includes(blockData)
        if (isInPreviousBlocks) return 'previous'
      }
    }
    return 'inactive'
  }

  render () {
    const { props, state } = this
    const exploitablePages = this.getExploitablePages()
    const { currentPagePos } = state
    const currPageData = exploitablePages !== undefined && currentPagePos !== undefined
      ? exploitablePages[currentPagePos]
      : undefined

    const zSortedFixedBlocks = this.getZSortedFixedBlocks()
    const scrollPanelZIndex = zSortedFixedBlocks
      .filter(blockWithZ => blockWithZ.blockData.depth === 'back')
      .length

    /* [WIP]
     * - OK load modules
     * - layout
     * - transitions
     * - give context props to modules
     */

    return <div
      className={styles['wrapper']}
      style={{
        backgroundColor: currPageData?.bgColor,
        ['--fixed-blocks-height']: props.fixedBlocksHeight ?? '100vh',
        ['--bg-color-transition-duration']: this.getBgColorTransitionDuration(),
        ['--scroll-panel-z-index']: scrollPanelZIndex
      }}>
      {zSortedFixedBlocks.map(blockWithZ => {
        const { blockData, zIndex } = blockWithZ
        const stickyBlockClasses = [styles['sticky-block']]
        if (blockData.depth === 'back') stickyBlockClasses.push(styles['sticky-block_back'])
        if (blockData.depth === 'front') stickyBlockClasses.push(styles['sticky-block_front'])
        const hasId = 'id' in blockData && blockData.id !== undefined
        const key = hasId ? blockData.id : blockData
        return <div
          key={key}
          className={stickyBlockClasses.join(' ')}
          style={{ ['--z-index']: zIndex }}>
          <div className={styles['sticky-block-inner']}>
            <BlockRenderer
            status={this.getBlockCurrentStatus(blockData)}
            type={blockData.type}
            content={blockData.content} />
          </div>
        </div>
      })}
      <div className={styles['scroll-panel']}>
        <Paginator
          thresholdOffset={props.thresholdOffset}
          onPageChange={this.handlePageChange}>
          {exploitablePages?.map((pageData, pagePos) => (
            <Paginator.Page value={pagePos}>{
              pageData.blocks
                ?.filter(blockData => blockData.depth === 'scroll')
                .map(blockData => <BlockRenderer
                  type={blockData.type}
                  content={blockData.content} />)
            }</Paginator.Page>)
          )}
        </Paginator>
      </div>
    </div>
  }
}
