import { Component } from 'preact'
import IntersectionObserverComponent from '../../components/IntersectionObserver'
import Paginator, { State as PaginatorState } from '../../components/Paginator'
import ResizeObserverComponent from '../../components/ResizeObserver'
import BlockRenderer from './BlockRenderer/index'
import styles from './styles.module.scss'
import TransitionsWrapper, { TransitionDescriptor } from './TransitionsWrapper'

/* Block Data Types */
type BlockDataLayoutName = 'left-half'|'right-half'

type BlockDataScrollingDepth = 'scroll'
type BlockDataFrontDepth = 'front'
type BlockDataBackDepth = 'back'

type BlockDataScrollingDepthPartial = { depth?: BlockDataScrollingDepth }
type BlockDataFrontDepthPartial = { depth: BlockDataFrontDepth }
type BlockDataBackDepthPartial = { depth: BlockDataBackDepth }
type BlockDataFixedDepthPartial = (BlockDataFrontDepthPartial|BlockDataBackDepthPartial) & {
  id?: string
  zIndex?: number
  transitions?: TransitionDescriptor[]
  mobileTransitions?: TransitionDescriptor[]
}

type BlockDataHTMLType = 'html'
type BlockDataModuleType = 'module'

type BlockDataHTMLTypePartial = { type?: BlockDataHTMLType }
type BlockDataModuleTypePartial = { type: BlockDataModuleType }

type BlockDataScrollingHTMLPartial = BlockDataScrollingDepthPartial & BlockDataHTMLTypePartial
// Scrolling module does not exist yet
type BlockDataFixedHTMLPartial = BlockDataFixedDepthPartial & BlockDataHTMLTypePartial
type BlockDataFixedModulePartial = BlockDataFixedDepthPartial & BlockDataModuleTypePartial & { trackScroll?: boolean }

type BlockDataCommonProperties = {
  content?: string
  layout?: BlockDataLayoutName
  mobileLayout?: BlockDataLayoutName
}

type BlockDataFixed = (
  BlockDataFixedHTMLPartial
  |BlockDataFixedModulePartial
) & BlockDataCommonProperties
type BlockDataScrolling = BlockDataScrollingHTMLPartial & BlockDataCommonProperties

type BlockDataReference = { id?: string }

type BlockData = BlockDataFixed|BlockDataScrolling|BlockDataReference

/* Block Context Types */
export type BlockContext = {
  width: number|null
  height: number|null
  page: number|null
  progression: number|null
  pageProgression: number|null
}

type PartialBlockContext = Partial<BlockContext>

const nullContext: BlockContext = {
  width: null,
  height: null,
  page: null,
  progression: null,
  pageProgression: null
}

export const createBlockContext = (
  partialContext: PartialBlockContext
): BlockContext => ({
  ...nullContext,
  ...partialContext
})

export const contextsAreEqual = (
  contextA: BlockContext,
  contextB: BlockContext
): boolean => (
  Object.keys(contextA).every(_key => {
    const keyInA = _key in contextA
    const keyInB = _key in contextB
    if (!keyInA || !keyInB) return false
    const key = _key as keyof BlockContext
    return contextA[key] === contextB[key]
  })
)

/* Inner Component Types */
type BlockKey = string|BlockDataFixed

type FixedBlockDryContextUpdationQuery = {
  key: BlockKey
  updation: PartialBlockContext
}

type ExploitableBlockData = BlockDataScrolling|BlockDataFixed
type ExploitableBlockDataWithZIndex = {
  blockData: ExploitableBlockData,
  zIndex: number
}

export type PageData = {
  bgColor?: JSX.CSSProperties['backgroundColor']
  blocks?: BlockData[]
}

type ExploitablePageData = Omit<PageData, 'blocks'> & {
  blocks?: ExploitableBlockData[]
}

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
  scrollingPanelHeight?: number
  fixedBlocksContextMap?: Map<BlockKey, BlockContext>
  fixedBlocksPContextMap?: Map<BlockKey, BlockContext>
}

/* Actual Component */
export default class Scrollgneugneu extends Component<Props, State> {
  state: State = {}
  fixedBlocksResizeObserver = new ResizeObserver(e => this.handleFixedBlocksResize(e))
  fixedBlocksKeysToRefsMap: Map<BlockKey, HTMLDivElement| null> = new Map()
  constructor (props: Props) {
    super(props)
    this.topDetection = this.topDetection.bind(this)
    this.cntDetection = this.cntDetection.bind(this)
    this.btmDetection = this.btmDetection.bind(this)
    this.handleWindowScroll = this.handleWindowScroll.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handlePaginatorResize = this.handlePaginatorResize.bind(this)
    this.getBgColorTransitionDuration = this.getBgColorTransitionDuration.bind(this)
    this.getExploitablePages = this.getExploitablePages.bind(this)
    this.getBlockCurrentStatus = this.getBlockCurrentStatus.bind(this)
    this.getAllFixedBlocks = this.getAllFixedBlocks.bind(this)
    this.getDedupedFixedBlocks = this.getDedupedFixedBlocks.bind(this)
    this.getZSortedFixedBlocks = this.getZSortedFixedBlocks.bind(this)
    this.handleFixedBlocksResize = this.handleFixedBlocksResize.bind(this)
    this.dryUpdateFixedBlocksContexts = this.dryUpdateFixedBlocksContexts.bind(this)
    this.dryUpdateFixedBlockContext = this.dryUpdateFixedBlockContext.bind(this)
    this.updateFixedBlocksContexts = this.updateFixedBlocksContexts.bind(this)
    this.getFixedBlockKey = this.getFixedBlockKey.bind(this)
    this.getFixedBlockPages = this.getFixedBlockPages.bind(this)
    this.FixedBlocks = this.FixedBlocks.bind(this)
    this.ScrollBlocks = this.ScrollBlocks.bind(this)
  }

  componentDidMount(): void {
    this.observeFixedBlocks()
    window.addEventListener('scroll', this.handleWindowScroll)
  }

  componentDidUpdate(): void {
    this.unobserveFixedBlocks()
    this.observeFixedBlocks()
  }

  componentWillUnmount(): void {
    this.unobserveFixedBlocks()
    window.removeEventListener('scroll', this.handleWindowScroll)
  }

  observeFixedBlocks () {
    const { fixedBlocksKeysToRefsMap, fixedBlocksResizeObserver } = this
    const fixedBlocksRefs = Array.from(fixedBlocksKeysToRefsMap.values())
    fixedBlocksRefs.forEach(ref => {
      if (ref === null) return
      fixedBlocksResizeObserver.observe(ref)
    })
  }

  unobserveFixedBlocks () {
    const { fixedBlocksResizeObserver } = this
    fixedBlocksResizeObserver.disconnect()
  }

  /* * * * * * * * * * * * * * * * * * * * * *
   * SCRLGNGN POSITION DETECTION IN PAGE
   * * * * * * * * * * * * * * * * * * * * * */
  topDetection ({ isIntersecting }: IntersectionObserverEntry) { this.setState({ topVisible: isIntersecting }) }
  cntDetection ({ isIntersecting }: IntersectionObserverEntry) { this.setState({ cntVisible: isIntersecting }) }
  btmDetection ({ isIntersecting }: IntersectionObserverEntry) { this.setState({ btmVisible: isIntersecting }) }

  /* * * * * * * * * * * * * * * * * * * * * *
   * HANDLE WINDOW SCROLL
   * * * * * * * * * * * * * * * * * * * * * */
  handleWindowScroll () {
    console.log('scroll')
  }

  /* * * * * * * * * * * * * * * * * * * * * *
   * HANDLE PAGE CHANGE
   * * * * * * * * * * * * * * * * * * * * * */
  handlePageChange (paginatorState: PaginatorState) {
    const { coming, active, passed } = paginatorState
    const {
      getDedupedFixedBlocks,
      getFixedBlockPages,
      getFixedBlockKey,
      dryUpdateFixedBlocksContexts,
      state
    } = this
    const pagesLength = active.length + coming.length + passed.length
    const hasPages = pagesLength > 0
    const noneComing = coming.length === 0
    const nonePassed = passed.length === 0
    const noneActive = active.length === 0
    const pages = this.props.pages
    const isBeforeFirst = hasPages && noneActive && nonePassed
    const isAfterLast = hasPages && noneActive && noneComing
    let newCurrentPagePos: State['currentPagePos'] = paginatorState.value as number|undefined
    if (isBeforeFirst) newCurrentPagePos = pages !== undefined ? 0 : undefined
    if (isAfterLast) newCurrentPagePos = pages !== undefined ? pages.length - 1 : undefined
    const dryUpdationQueries: FixedBlockDryContextUpdationQuery[] = []
    const fixedBlocks = getDedupedFixedBlocks()
    fixedBlocks.forEach(fixedBlockData => {
      const blockKey = getFixedBlockKey(fixedBlockData)
      if (newCurrentPagePos === undefined) return dryUpdationQueries.push({
        key: blockKey,
        updation: {
          page: null,
          pageProgression: null,
          progression: null
        }
      })
      const thisBlockPages = getFixedBlockPages(fixedBlockData)
      const thisBlockCurrentPage = thisBlockPages.indexOf(newCurrentPagePos)
      if (thisBlockCurrentPage === - 1) return dryUpdationQueries.push({
        key: blockKey,
        updation: {
          page: null,
          pageProgression: null,
          progression: null
        }
      })
      return dryUpdationQueries.push({
        key: blockKey,
        updation: { page: thisBlockCurrentPage }
      })
    })
    const newFixedBlocksContextMap = dryUpdateFixedBlocksContexts(
      dryUpdationQueries,
      state.fixedBlocksContextMap
    )
    this.setState(curr => {
      return {
        ...curr,
        currentPagePos: newCurrentPagePos,
        previousPagePos: curr.currentPagePos,
        fixedBlocksContextMap: new Map(newFixedBlocksContextMap),
        fixedBlocksPContextMap: new Map(curr.fixedBlocksContextMap)
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
      if (curr.scrollingPanelHeight === height) return null
      return {
        ...curr,
        scrollingPanelHeight: height
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
  getAllFixedBlocks (): BlockDataFixed[] {
    const { getExploitablePages } = this
    const exploitablePages = getExploitablePages()
    const allFixedBlocks: BlockDataFixed[] = []
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
  getDedupedFixedBlocks (): BlockDataFixed[] {
    const { getAllFixedBlocks } = this
    const allFixedBlocks = getAllFixedBlocks()
    const dedupedFixedBlocks: BlockDataFixed[] = []
    const idsSet = new Set<string>()
    allFixedBlocks.forEach(blockData => {
      const idInBlockData = 'id' in blockData
      if (!idInBlockData) return dedupedFixedBlocks.push(blockData)
      const { id } = blockData
      const idIsUndef = id === undefined
      if (idIsUndef) return dedupedFixedBlocks.push(blockData)
      const alreadyInDeduped = idsSet.has(id)
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
  handleFixedBlocksResize (entries: ResizeObserverEntry[]) {
    const {
      fixedBlocksKeysToRefsMap,
      dryUpdateFixedBlocksContexts,
      updateFixedBlocksContexts,
      state
    } = this
    const keysToRefsArr = [...fixedBlocksKeysToRefsMap.entries()];
    const dryUpdationQueries: FixedBlockDryContextUpdationQuery[] = []
    entries.forEach(entry => {
      const { target } = entry
      const keyToRef = keysToRefsArr.find(([_key, ref]) => ref === target)
      if (keyToRef === undefined) return null
      const [blockKey] = keyToRef
      const { width, height } = entry.contentRect
      dryUpdationQueries.push({
        key: blockKey,
        updation: { width, height }
      })
    })
    const newFixedBlocksContextMap = dryUpdateFixedBlocksContexts(
      dryUpdationQueries,
      state.fixedBlocksContextMap
    )
    updateFixedBlocksContexts(newFixedBlocksContextMap)
  }

  /* * * * * * * * * * * * * * * * * * * * * *
   * DRY UPDATE FIXED BLOCKS CONTEXTS
   * * * * * * * * * * * * * * * * * * * * * */
  dryUpdateFixedBlocksContexts (
    queries: FixedBlockDryContextUpdationQuery[],
    currentContextsMap: State['fixedBlocksContextMap']
  ): State['fixedBlocksContextMap'] {
    const { dryUpdateFixedBlockContext } = this
    const newContextsMap = queries.reduce((acc, curr) => {
      const newMap = dryUpdateFixedBlockContext(curr, acc)
      return newMap
    }, currentContextsMap)
    return newContextsMap
  }

  dryUpdateFixedBlockContext (
    query: FixedBlockDryContextUpdationQuery,
    currentContextsMap: State['fixedBlocksContextMap']
  ): State['fixedBlocksContextMap'] {
    const { key: blockKey, updation } = query
    const newContexts: State['fixedBlocksContextMap'] = new Map(currentContextsMap)
    const currentBlockContext = currentContextsMap?.get(blockKey)
    if (currentBlockContext === undefined) newContexts.set(blockKey, createBlockContext(updation))
    else newContexts.set(blockKey, {
      ...currentBlockContext,
      ...updation
    })
    return newContexts
  }

  /* * * * * * * * * * * * * * * * * * * * * *
   * UPDATE FIXED BLOCKS CONTEXTS
   * * * * * * * * * * * * * * * * * * * * * */
  updateFixedBlocksContexts (newContext: State['fixedBlocksContextMap']) {
    this.setState(curr => {
      const currContext = curr.fixedBlocksContextMap
      if (newContext === undefined) return {
        ...curr,
        fixedBlocksContextMap: undefined,
        fixedBlocksPContextMap: new Map(currContext)
      }
      const allContextsAreEqual = [...newContext.entries()].every(([blockKey, blockNewContext]) => {
        const blockCurrContext = currContext?.get(blockKey)
        if (blockNewContext === undefined && blockCurrContext === undefined) return true
        if (blockNewContext === undefined) return false
        if (blockCurrContext === undefined) return false
        return contextsAreEqual(blockCurrContext, blockNewContext)
      })
      if (allContextsAreEqual) return null
      return {
        ...curr,
        fixedBlocksContextMap: new Map(newContext),
        fixedBlocksPContextMap: new Map(currContext)
      }
    })
  }

  /* * * * * * * * * * * * * * * * * * * * * *
   * GET FIXED BLOCK KEY
   * * * * * * * * * * * * * * * * * * * * * */
  getFixedBlockKey (fixedBlockData: BlockDataFixed): BlockKey {
    const idInBlockData = 'id' in fixedBlockData
    if (!idInBlockData) return fixedBlockData
    const { id } = fixedBlockData
    if (id === undefined) return fixedBlockData
    return id
  }

  /* * * * * * * * * * * * * * * * * * * * * *
   * GET FIXED BLOCK PAGES
   * * * * * * * * * * * * * * * * * * * * * */
  getFixedBlockPages (fixedBlockData: BlockDataFixed) {
    const { getExploitablePages } = this
    const exploitablePages = getExploitablePages()
    const pagesPos: number[] = []
    exploitablePages?.forEach((pageData, pagePos) => {
      const { blocks } = pageData
      if (blocks?.includes(fixedBlockData)) pagesPos.push(pagePos)
    })
    return pagesPos
  }

  /* * * * * * * * * * * * * * * * * * * * * *
   * GENERATE DISPLAYED FIXED BLOCKS
   * * * * * * * * * * * * * * * * * * * * * */
  FixedBlocks () {
    const {
      state,
      getZSortedFixedBlocks,
      getBlockCurrentStatus
    } = this
    const zSortedFixedBlocks = getZSortedFixedBlocks()
    const fixedBlocks = zSortedFixedBlocks.map(blockWithZ => {
      const { blockData: _blockData, zIndex } = blockWithZ
      const blockData = _blockData as BlockDataFixed
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
      const key = this.getFixedBlockKey(blockData)
      // Context
      const blockContext = state.fixedBlocksContextMap?.get(key)
      return <div
        key={key}
        ref={n => { this.fixedBlocksKeysToRefsMap.set(key, n) }}
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
        <Paginator.Page
          value={pagePos}>{
          pageData.blocks
            ?.filter(blockData => blockData.depth === 'scroll')
            .map(blockData => {
              const classes = [styles['scrolling-block']]
              if (blockData.layout !== undefined) classes.push(styles[`layout-${blockData.layout}`])
              if (blockData.mobileLayout === undefined) classes.push(styles[`layout-mobile-${blockData.layout}`])
              if (blockData.mobileLayout !== undefined) classes.push(styles[`layout-mobile-${blockData.mobileLayout}`])
              return <div
                className={classes.join(' ')}>
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
    const exploitablePages = this.getExploitablePages()
    const { currentPagePos } = state
    const currPageData = exploitablePages !== undefined && currentPagePos !== undefined
      ? exploitablePages[currentPagePos]
      : undefined

    const zSortedFixedBlocks = this.getZSortedFixedBlocks()
    const scrollPanelZIndex = zSortedFixedBlocks
      .filter(blockWithZ => blockWithZ.blockData.depth === 'back')
      .length

    /*
     * [WIP]
     * - OK load modules
     * - OK layout
     * - OK transitions
     * - OK give context props to modules
     * - OK give page context
     * - give scroll context
     * - load modules css
     * - load modules libs
     * - modules can scroll
     * - take transition types back here
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
        ['--scrolling-block-height']: `${state.scrollingPanelHeight}px`,
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