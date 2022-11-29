import { Component } from 'preact'
import IntersectionObserverComponent from '../../components/IntersectionObserver'
import Paginator, { State as PaginatorState } from '../../components/Paginator'
import ResizeObserverComponent from '../../components/ResizeObserver'
import BlockRenderer, { BlockContext } from './BlockRenderer'
import styles from './styles.module.scss'
import TransitionsWrapper, { TransitionDescriptor } from './TransitionsWrapper'

type BlockLayoutName = 'left-half'|'right-half'

type CommonBlockData = {
  type?: 'module'|'html'
  content?: string
  layout?: BlockLayoutName
  mobileLayout?: BlockLayoutName
}
type ScrollingBlockData = CommonBlockData & { depth?: 'scroll' }
type FixedBlockData = CommonBlockData & {
  depth: 'back'|'front'
  id?: string
  zIndex?: number
  transitions?: TransitionDescriptor[]
  mobileTransitions?: TransitionDescriptor[]
}
type ReferenceBlockData = { id?: string }
type BlockData = ScrollingBlockData|FixedBlockData|ReferenceBlockData
type ExploitableBlockData = ScrollingBlockData|FixedBlockData
type ExploitableBlockDataWithZIndex = { blockData: ExploitableBlockData, zIndex: number }

export type PageData = {
  bgColor?: JSX.CSSProperties['backgroundColor']
  blocks?: BlockData[]
}
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
  topVisible?: boolean
  cntVisible?: boolean
  btmVisible?: boolean
  scrollingBlockHeight?: number
  fixedBlocksContextMap?: Map<any, BlockContext>
}

export default class Scrollgneugneu extends Component<Props, State> {
  state: State = {}
  constructor (props: Props) {
    super(props)
    this.topDetection = this.topDetection.bind(this)
    this.cntDetection = this.cntDetection.bind(this)
    this.btmDetection = this.btmDetection.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handlePaginatorResize = this.handlePaginatorResize.bind(this)
    this.getBgColorTransitionDuration = this.getBgColorTransitionDuration.bind(this)
    this.getExploitablePages = this.getExploitablePages.bind(this)
    this.getBlockCurrentStatus = this.getBlockCurrentStatus.bind(this)
    this.getAllFixedBlocks = this.getAllFixedBlocks.bind(this)
    this.getDedupedFixedBlocks = this.getDedupedFixedBlocks.bind(this)
    this.getZSortedFixedBlocks = this.getZSortedFixedBlocks.bind(this)
    this.handleFixedBlockResize = this.handleFixedBlockResize.bind(this)
    this.FixedBlocks = this.FixedBlocks.bind(this)
    this.ScrollBlocks = this.ScrollBlocks.bind(this)
    console.log('SCRLLGNGN - CONSTRUCT')
  }

  componentDidMount() {
    console.log('SCRLLGNGN - DID MOUNT\n\n\n')
  }

  componentDidUpdate() {
    console.log('SCRLLGNGN - DID UPDATE\n\n\n')
  }

  /* * * * * * * * * * * * * * * * * * * * * *
   * POSITION DETECTION IN PAGE
   * * * * * * * * * * * * * * * * * * * * * */
  topDetection ({ isIntersecting }: IntersectionObserverEntry) { this.setState({ topVisible: isIntersecting }) }
  cntDetection ({ isIntersecting }: IntersectionObserverEntry) { this.setState({ cntVisible: isIntersecting }) }
  btmDetection ({ isIntersecting }: IntersectionObserverEntry) { this.setState({ btmVisible: isIntersecting }) }

  /* * * * * * * * * * * * * * * * * * * * * *
   * HANDLE PAGE CHANGE
   * * * * * * * * * * * * * * * * * * * * * */
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
    this.setState(curr => {
      return {
        ...curr,
        currentPagePos: paginatorState.value as number|undefined,
        previousPagePos: curr.currentPagePos
      }
    })
  }

  /* * * * * * * * * * * * * * * * * * * * * *
   * HANDLE PAGINATOR RESIZE
   * * * * * * * * * * * * * * * * * * * * * */
  handlePaginatorResize (entries: ResizeObserverEntry[]) {
    const $paginator = entries[0]
    if ($paginator === undefined) return
    const { contentRect } = $paginator
    const { height } = contentRect
    this.setState(curr => {
      if (curr.scrollingBlockHeight === height) return null
      return {
        ...curr,
        scrollingBlockHeight: height
      }
    })
  }

  /* * * * * * * * * * * * * * * * * * * * * *
   * GET BG COLOR TRANSITION DURATION
   * * * * * * * * * * * * * * * * * * * * * */
  getBgColorTransitionDuration (): string {
    const { bgColorTransitionDuration } = this.props
    if (typeof bgColorTransitionDuration === 'number') return `${bgColorTransitionDuration}ms`
    if (typeof bgColorTransitionDuration === 'string') return bgColorTransitionDuration
    return '200ms'
  }

  /* * * * * * * * * * * * * * * * * * * * * *
   * GET EXPLOITABLE PAGES
   * * * * * * * * * * * * * * * * * * * * * */
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
  
  /* * * * * * * * * * * * * * * * * * * * * *
   * GET BLOCK CURRENT STATUS
   * * * * * * * * * * * * * * * * * * * * * */
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

  /* * * * * * * * * * * * * * * * * * * * * *
   * GET ALL FIXED BLOCKS
   * * * * * * * * * * * * * * * * * * * * * */
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

  /* * * * * * * * * * * * * * * * * * * * * *
   * GET DEDUPED FIXED BLOCKS
   * * * * * * * * * * * * * * * * * * * * * */
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

  /* * * * * * * * * * * * * * * * * * * * * *
   * GET Z SORTED FIXED BLOCKS
   * * * * * * * * * * * * * * * * * * * * * */
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

  /* * * * * * * * * * * * * * * * * * * * * *
   * HANDLE FIXED BLOCK RESIZE
   * * * * * * * * * * * * * * * * * * * * * */
  handleFixedBlockResize (entries: ResizeObserverEntry[], key: any) {
    const [entry] = entries
    const { width, height } = entry.contentRect
    console.log('SCRLLGNGN - HANDLE FIX BLK RESIZE', { width, height })
    this.setState(curr => {
      const currentMap = curr.fixedBlocksContextMap
      if (currentMap === undefined) {
        const newMap = new Map<any, BlockContext>()
        newMap.set(key, { width, height })
        return {
          ...curr,
          fixedBlocksContextMap: newMap
        }
      }
      const currentContext = currentMap.get(key)
      if (currentContext === undefined) {
        const newMap = new Map<any, BlockContext>(currentMap)
        newMap.set(key, { width, height })
        return { ...curr, fixedBlocksContextMap: newMap }
      }
      const { width: currWidth, height: currHeight } = currentContext
      if (currWidth === width && currHeight === height) return null
      const newMap = new Map<any, BlockContext>(currentMap)
      newMap.set(key, { width, height })
      return { ...curr, fixedBlocksContextMap: newMap }
    })
  }

  /* * * * * * * * * * * * * * * * * * * * * *
   * GENERATE DISPLAYED FIXED BLOCKS
   * * * * * * * * * * * * * * * * * * * * * */
  FixedBlocks () {
    const {
      state,
      handleFixedBlockResize: onResize,
      getZSortedFixedBlocks,
      getBlockCurrentStatus
    } = this
    const zSortedFixedBlocks = getZSortedFixedBlocks()
    const fixedBlocks = zSortedFixedBlocks.map(blockWithZ => {
      const { blockData: _blockData, zIndex } = blockWithZ
      const blockData = _blockData as FixedBlockData
      const stickyBlockClasses = [styles['sticky-block']]
      // Status classes
      const blockStatus = getBlockCurrentStatus(blockData)
      stickyBlockClasses.push(styles[`status-${blockStatus}`])
      // Layout classes
      const hasLayout = blockData.layout !== undefined
      const hasMobileLayout = blockData.mobileLayout !== undefined
      if (hasLayout) stickyBlockClasses.push(styles[`layout-${blockData.layout}`])
      if (hasLayout && !hasMobileLayout) stickyBlockClasses.push(styles[`layout-mobile-${blockData.layout}`])
      if (hasMobileLayout) stickyBlockClasses.push(styles[`layout-mobile-${blockData.mobileLayout}`]) 
      const hasId = 'id' in blockData && blockData.id !== undefined
      const key = hasId ? blockData.id : blockData
      // Context
      const blockContext = state.fixedBlocksContextMap?.get(key)
      console.log('SCRLLGNGN - CREATE FIXED BLOCK', blockContext)
      return <ResizeObserverComponent
        onResize={e => onResize(e, key)}>
        <div
          key={key}
          className={stickyBlockClasses.join(' ')}
          style={{ ['--z-index']: zIndex }}>
          <TransitionsWrapper
            isActive={blockStatus === 'current'}
            transitions={blockData.transitions}
            mobileTransitions={blockData.mobileTransitions}>
            <BlockRenderer
              type={blockData.type}
              content={blockData.content}
              context={blockContext} />
          </TransitionsWrapper>
        </div>
      </ResizeObserverComponent>
    })
    return <>{fixedBlocks}</>
  }

  /* * * * * * * * * * * * * * * * * * * * * *
   * GENERATE DISPLAYED SCROLLING BLOCKS
   * * * * * * * * * * * * * * * * * * * * * */
  ScrollBlocks () {
    const { props, getExploitablePages } = this
    const exploitablePages = getExploitablePages()
    return <Paginator
      thresholdOffset={props.thresholdOffset}
      onPageChange={this.handlePageChange}>
      {exploitablePages?.map((pageData, pagePos) => (
        <Paginator.Page value={pagePos}>{
          pageData.blocks
            ?.filter(blockData => blockData.depth === 'scroll')
            .map(blockData => {
              const classes = [styles['scrolling-block']]
              if (blockData.layout !== undefined) classes.push(styles[`layout-${blockData.layout}`])
              if (blockData.mobileLayout === undefined) classes.push(styles[`layout-mobile-${blockData.layout}`])
              if (blockData.mobileLayout !== undefined) classes.push(styles[`layout-mobile-${blockData.mobileLayout}`])
              return <div className={classes.join(' ')}>
                <BlockRenderer
                  type={blockData.type}
                  content={blockData.content} />
              </div>
            })
        }</Paginator.Page>)
      )}
    </Paginator>
  }

  /* * * * * * * * * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * * * * * * * * */
  render () {
    const {
      props,
      state,
      FixedBlocks,
      ScrollBlocks
    } = this
    console.log('SCRLLGNGN - RENDER')
    console.log(props)
    console.log(state)
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
     * - OK layout
     * - OK transitions
     * - give context props to modules
     */

    const { topVisible, cntVisible, btmVisible } = state
    const blocksAreFixed = cntVisible === true && topVisible !== true && btmVisible !== true
    const offsetFixed = !blocksAreFixed && btmVisible

    const wrapperClasses = [styles['wrapper']]
    if (blocksAreFixed) wrapperClasses.push(styles['wrapper_fix-blocks'])
    if (offsetFixed) wrapperClasses.push(styles['wrapper_offset-fixed-blocks'])
    return <div
      className={wrapperClasses.join(' ')}
      style={{
        backgroundColor: currPageData?.bgColor,
        ['--fixed-blocks-height']: props.fixedBlocksHeight ?? '100vh',
        ['--scrolling-block-height']: `${state.scrollingBlockHeight}px`,
        ['--bg-color-transition-duration']: this.getBgColorTransitionDuration(),
        ['--scroll-panel-z-index']: scrollPanelZIndex
      }}>      
      <FixedBlocks />
      <div className={styles['scroll-panel']}>
        {/* TOP BOUND DETECTION */}
        <IntersectionObserverComponent
          render={<div />}
          callback={this.topDetection} />
        {/* CONTENT */}
        <IntersectionObserverComponent callback={this.cntDetection}>
          <ResizeObserverComponent onResize={this.handlePaginatorResize}>
            <ScrollBlocks />
          </ResizeObserverComponent>
        </IntersectionObserverComponent>
        {/* BOTTOM BOUND DETECTION */}
        <IntersectionObserverComponent
          render={<div />}
          callback={this.btmDetection} />
      </div>
    </div>
  }
}
