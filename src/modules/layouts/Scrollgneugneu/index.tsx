/*
 * [WIP]
 * - OK load modules
 * - OK layout
 * - OK transitions
 * - OK give context props to modules
 * - OK give page context
 * - OK give scroll context
 * - OK load modules css
 * - modules can depth: 'scroll'
 * - take transition types back here
 * - modules lazy load?
 * - make this work in smaller frames than the full window ?
 */

import { Component } from 'preact'
import IntersectionObserverComponent from '../../components/IntersectionObserver'
import Paginator, { State as PaginatorState } from '../../components/Paginator'
import ResizeObserverComponent from '../../components/ResizeObserver'
import BlockRenderer from './BlockRenderer/index'
import styles from './styles.module.scss'
import TransitionsWrapper, { TransitionDescriptor } from './TransitionsWrapper'

/* Block Data Types */
export type BlockDataLayoutName = 'left-half'|'right-half'

export type BlockDataScrollingDepth = 'scroll'
export type BlockDataFrontDepth = 'front'
export type BlockDataBackDepth = 'back'
export type BlockDataDepth = BlockDataScrollingDepth|BlockDataFrontDepth|BlockDataBackDepth

export type BlockDataScrollingDepthPartial = { depth?: BlockDataScrollingDepth }
export type BlockDataFrontDepthPartial = { depth: BlockDataFrontDepth }
export type BlockDataBackDepthPartial = { depth: BlockDataBackDepth }
export type BlockDataFixedDepthPartial = (BlockDataFrontDepthPartial|BlockDataBackDepthPartial) & {
  id?: string
  zIndex?: number
  transitions?: TransitionDescriptor[]
  mobileTransitions?: TransitionDescriptor[]
}

export type BlockDataHTMLType = 'html'
export type BlockDataModuleType = 'module'
export type BlockDataType = BlockDataHTMLType|BlockDataModuleType

export type BlockDataHTMLTypePartial = { type?: BlockDataHTMLType }
export type BlockDataModuleTypePartial = { type: BlockDataModuleType }

export type BlockDataScrollingHTMLPartial = BlockDataScrollingDepthPartial & BlockDataHTMLTypePartial
// [WIP] Scrolling module does not exist yet
export type BlockDataFixedHTMLPartial = BlockDataFixedDepthPartial & BlockDataHTMLTypePartial
export type BlockDataFixedModulePartial = BlockDataFixedDepthPartial & BlockDataModuleTypePartial & { trackScroll?: boolean }

export type BlockDataCommonProperties = {
  content?: string // [WIP] change this to url for modules?
  layout?: BlockDataLayoutName
  mobileLayout?: BlockDataLayoutName
}

export type BlockDataFixed = (BlockDataFixedHTMLPartial|BlockDataFixedModulePartial) & BlockDataCommonProperties
export type BlockDataScrolling = BlockDataScrollingHTMLPartial & BlockDataCommonProperties
export type BlockDataReference = { id?: string }
export type BlockData = BlockDataFixed|BlockDataScrolling|BlockDataReference

/* Block Context Types */
export type BlockContext = {
  width: number|null
  height: number|null
  page: number|null
  progression: number|null
  pageProgression: number|null
}

export type PartialBlockContext = Partial<BlockContext>

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
  // [WIP] fixedBlockHeight?: string ?
  thresholdOffset?: string
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
  loadedCssFilesUrlToDataMap?: Map<string, string>
}

/* Actual Component */
export default class Scrollgneugneu extends Component<Props, State> {
  state: State = {}
  fixedBlocksResizeObserver = new ResizeObserver(e => this.handleFixedBlocksResize(e))
  fixedBlocksKeysToRefsMap: Map<BlockKey, HTMLDivElement| null> = new Map()
  scrollingBlocksPosToRefsMap: Map<number, HTMLDivElement|null> = new Map()
  paginatorRef: Paginator|null = null
  constructor (props: Props) {
    super(props)
    this.loadCss = this.loadCss.bind(this)
    this.topDetection = this.topDetection.bind(this)
    this.cntDetection = this.cntDetection.bind(this)
    this.btmDetection = this.btmDetection.bind(this)
    this.handleWindowScroll = this.handleWindowScroll.bind(this)
    this.doesPageNeedScrollTracking = this.doesPageNeedScrollTracking.bind(this)
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

  // [WIP] make a function that loads multiple css at once?
  //       Can retry ?
  //       let BlockRenderer do this?
  async loadCss (url: string) {
    try {
      const requestResponse = await window.fetch(url)
      const responseData = await requestResponse.text()
      this.setState(curr => {
        // [WIP] dirty type cast in order to build quick before holidays
        const newLoadedCssFilesUrlToDataMap = new Map(curr.loadedCssFilesUrlToDataMap as Map<string, string>)
        newLoadedCssFilesUrlToDataMap.set(url, responseData)
        return {
          ...curr,
          loadedCssFilesUrlToDataMap: newLoadedCssFilesUrlToDataMap
        }
      })
    } catch (err) {
      console.error(err)
    }
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
    // [WIP] divide this into smaller chunks
    // [WIP] make this work on did mount and did update
    const {
      state,
      getExploitablePages,
      getDedupedFixedBlocks,
      getFixedBlockPages,
      paginatorRef,
      scrollingBlocksPosToRefsMap,
      doesPageNeedScrollTracking,
      dryUpdateFixedBlocksContexts,
      getFixedBlockKey
    } = this
    if (paginatorRef === null) return
    // Undefined page pos
    const { currentPagePos } = state
    if (currentPagePos === undefined) return
    // Undefined exploitable pages
    const exploitablePages = getExploitablePages()
    if (exploitablePages === undefined) return
    // No need for scroll tracking on current page
    const currentPageData = exploitablePages[currentPagePos]
    const pageNeedsScrollTracking = doesPageNeedScrollTracking(currentPageData)
    if (!pageNeedsScrollTracking) return
    // Threshold not found
    // [WIP] throttle/cache threshold bar detection for performance
    const thresholdBarRect = paginatorRef.getThresholdBarBoundingClientRect()
    if (thresholdBarRect === undefined) return
    // [WIP] can be heavy throttled/cached (via prop ?) since result never really changes
    const fixedBlocksWithDisplayZone = getDedupedFixedBlocks().map(
      // [WIP] make this a this.method
      blockData => {
        const blockKey = getFixedBlockKey(blockData)
        const hasNoTrackScroll = !('trackScroll' in blockData) || blockData.trackScroll === undefined
        if (hasNoTrackScroll) return { key: blockKey, displayZone: [] }
        const blockPages = getFixedBlockPages(blockData)
        const currentPageInBlockPages = blockPages.includes(currentPagePos)
        if (!currentPageInBlockPages) return { key: blockKey, displayZone: [] }
        const pagesBefore = blockPages.filter(pos => pos < currentPagePos).sort((a, b) => b - a)
        const pagesAfter = blockPages.filter(pos => pos > currentPagePos).sort((a, b) => a - b)
        const displayZone: number[] = [currentPagePos]
        pagesBefore.forEach(pagePos => {
          const firstPos = displayZone[0]
          if (firstPos - pagePos === 1) displayZone.unshift(pagePos)
        })
        pagesAfter.forEach(pagePos => {
          const lastPos = displayZone.at(-1)
          if (lastPos === undefined) return // Not really possible either but heh
          if (pagePos - lastPos === 1) displayZone.push(pagePos)
        })
        return { key: blockKey, displayZone }
      }
    ).filter(blockData => blockData.displayZone.length > 0)
    if (fixedBlocksWithDisplayZone.length === 0) return // Not possible since we know currentPageData needs scroll tracking
    // Pages progression data
    const { top: thresholdBarTop } = thresholdBarRect
    const scrollingBlocksPosToRefsArr = [...scrollingBlocksPosToRefsMap.entries()]
    const pagesScrollDataMap: Map<number, {
      ref: HTMLDivElement|null
      height?: number
      progression?: number
      scrolled?: number
    }> = new Map() // [WIP] fill via scrollingBlocksPosToRefsArr.map as a param ?
    scrollingBlocksPosToRefsArr.forEach(([pos, ref]) => {
      if (ref === null) return pagesScrollDataMap.set(pos, { ref })
      const { top, height } = ref.getBoundingClientRect()
      const scrolled = thresholdBarTop - top
      const progression = scrolled / height
      return pagesScrollDataMap.set(pos, { ref, height, progression, scrolled })
    })
    const currentPageProgressionData = pagesScrollDataMap.get(currentPagePos)
    const currentPageProgression = currentPageProgressionData?.progression ?? 0
    // Fixed blocks context updation
    const fixedBlocksUpdateQueries: FixedBlockDryContextUpdationQuery[] = []
    fixedBlocksWithDisplayZone.forEach(({ key: blockKey, displayZone }) => {
      const displayZoneScrolledData = displayZone.reduce((acc, pagePos) => {
        const pageProgressionData = pagesScrollDataMap.get(pagePos)
        if (pageProgressionData === undefined) return acc
        let scrolled = 0
        if (pagePos < currentPagePos) scrolled = pageProgressionData.height ?? 0
        else if (pagePos === currentPagePos) scrolled = pageProgressionData.scrolled ?? 0 
        else scrolled = 0
        return {
          scrolled: acc.scrolled + scrolled,
          height: acc.height + (pageProgressionData.height ?? 0)
        }
      }, { scrolled: 0, height: 0 })
      let progression = displayZoneScrolledData.scrolled / displayZoneScrolledData.height
      if (progression < 0) progression = 0
      if (progression > 1) progression = 1
      let pageProgression = currentPageProgression
      if (pageProgression < 0) pageProgression = 0
      if (pageProgression > 1) pageProgression = 1
      fixedBlocksUpdateQueries.push({
        key: blockKey,
        updation: {
          progression,
          pageProgression
        }
      } as FixedBlockDryContextUpdationQuery)
    })
    const dryUpdationResult = dryUpdateFixedBlocksContexts(
      fixedBlocksUpdateQueries,
      state.fixedBlocksContextMap
    )
    this.updateFixedBlocksContexts(dryUpdationResult)
  }

  doesPageNeedScrollTracking (pageData: ExploitablePageData) {
    return pageData.blocks?.some(blockData => {
      const { depth, type } = blockData
      const isFixed = depth === 'front' || depth === 'back'
      const isModule = type === 'module'
      if (!isFixed || !isModule) return false
      if (blockData.trackScroll) return true
      return false
    })
  }

  /* * * * * * * * * * * * * * * * * * * * * *
   * HANDLE PAGE CHANGE
   * * * * * * * * * * * * * * * * * * * * * */
  handlePageChange (paginatorState: PaginatorState) {
    // [WIP] maybe divide this into smaller chunks
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
        // [WIP] dirty type casts in order to build quick before holidays
        fixedBlocksContextMap: new Map(newFixedBlocksContextMap as Map<BlockKey, BlockContext>),
        fixedBlocksPContextMap: new Map(curr.fixedBlocksContextMap as Map<BlockKey, BlockContext>)
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
    // [WIP] dirty type cast in order to build quick before holidays
    const newContexts: State['fixedBlocksContextMap'] = new Map(currentContextsMap as Map<BlockKey, BlockContext>)
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
    // [WIP] individual check contextsAreEqual ?
    this.setState(curr => {
      const currContext = curr.fixedBlocksContextMap
      if (newContext === undefined) return {
        ...curr,
        fixedBlocksContextMap: undefined,
        // [WIP] dirty type cast in order to build quick before holidays
        fixedBlocksPContextMap: new Map(currContext as Map<BlockKey, BlockContext>)
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
        // [WIP] dirty type casts in order to build quick before holidays
        fixedBlocksContextMap: new Map(newContext as Map<BlockKey, BlockContext>),
        fixedBlocksPContextMap: new Map(currContext as Map<BlockKey, BlockContext>)
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
      getBlockCurrentStatus,
      loadCss
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
      const blockPrevContext = state.fixedBlocksPContextMap?.get(key)
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
            context={blockContext}
            prevContext={blockPrevContext}
            cssLoader={loadCss} />
        </TransitionsWrapper>
      </div>
    })
    return <>{fixedBlocks}</>
  }

  /* * * * * * * * * * * * * * * * * * * * * *
   * GENERATE DISPLAYED SCROLLING BLOCKS
   * * * * * * * * * * * * * * * * * * * * * */
  ScrollBlocks () {
    const {
      props,
      getExploitablePages,
      loadCss
    } = this
    const exploitablePages = getExploitablePages()
    return <Paginator
      thresholdOffset={props.thresholdOffset}
      onPageChange={this.handlePageChange}
      ref={(n: Paginator) => { this.paginatorRef = n }}>
      {exploitablePages?.map((pageData, pagePos) => (
        <Paginator.Page
          pageRef={n => { this.scrollingBlocksPosToRefsMap.set(pagePos, n) }}
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
                  content={blockData.content}
                  cssLoader={loadCss} />
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
      state,
      getExploitablePages,
      getZSortedFixedBlocks,
      getBgColorTransitionDuration,
      topDetection,
      cntDetection,
      handlePaginatorResize,
      btmDetection,
      FixedBlocks,
      ScrollBlocks
    } = this
    // Exploitable pages and currend page data
    const exploitablePages = getExploitablePages()
    const { currentPagePos } = state
    const currPageData = exploitablePages !== undefined && currentPagePos !== undefined
      ? exploitablePages[currentPagePos]
      : undefined
    // Get scroll panel zIndex [WIP] - make a method of it ?
    const zSortedFixedBlocks = getZSortedFixedBlocks()
    const scrollPanelZIndex = zSortedFixedBlocks
      .filter(blockWithZ => blockWithZ.blockData.depth === 'back')
      .length
    // Detect if blocks are fixed or not
    const { topVisible, cntVisible, btmVisible } = state
    const blocksAreFixed = cntVisible === true && topVisible !== true && btmVisible !== true
    const offsetFixed = !blocksAreFixed && btmVisible
    // Gather loaded css from modules
    const loadedCssNoUndefMap = state.loadedCssFilesUrlToDataMap ?? new Map<string, string>()
    const loadedCssUrlToDataArr = [...loadedCssNoUndefMap.entries()]
    // Assign css classes to wrapper
    const wrapperClasses = [styles['wrapper']]
    if (blocksAreFixed) wrapperClasses.push(styles['wrapper_fix-blocks'])
    if (offsetFixed) wrapperClasses.push(styles['wrapper_offset-fixed-blocks'])
    // Return virtual DOM
    return <div
      className={wrapperClasses.join(' ')}
      style={{
        backgroundColor: currPageData?.bgColor,
        ['--fixed-blocks-height']: '100vh',
        ['--scrolling-block-height']: `${state.scrollingPanelHeight}px`,
        ['--bg-color-transition-duration']: getBgColorTransitionDuration(),
        ['--scroll-panel-z-index']: scrollPanelZIndex
      }}>
      {/* MODULES STYLES */}
      {loadedCssUrlToDataArr.map(([url, data]) => {
        const oneLineData = data
          .trim()
          .replace(/\s+/igm, ' ')
          .replace(/\n/igm, ' ')
        return <style key={url} data-url={url}>
          {oneLineData}
        </style>
      })}
      {/* FIXED BLOCKS */}
      <FixedBlocks />
      {/* SCROLLING CONTENT */}
      <div className={styles['scroll-panel']}>
        {/* TOP BOUND DETECTION */}
        <IntersectionObserverComponent
          render={<div />}
          callback={topDetection} />
        {/* CONTENT */}
        <IntersectionObserverComponent callback={cntDetection}>
          <ResizeObserverComponent onResize={handlePaginatorResize}>
            <ScrollBlocks />
          </ResizeObserverComponent>
        </IntersectionObserverComponent>
        {/* BOTTOM BOUND DETECTION */}
        <IntersectionObserverComponent
          render={<div />}
          callback={btmDetection} />
      </div>
    </div>
  }
}
