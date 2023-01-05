import { Component } from 'preact'
import IntersectionObserverComponent from '../../components/IntersectionObserver'
import Paginator, { State as PaginatorState } from '../../components/Paginator'
import ResizeObserverComponent from '../../components/ResizeObserver'
import BlockRenderer from './BlockRenderer/index'
import styles from './styles.module.scss'
import TransitionsWrapper, { TransitionDescriptor } from './TransitionsWrapper'
import { throttle } from '../../utils/throttle-debounce'

/*
 * [WIP]
 * - OK load modules
 * - OK layout
 * - OK transitions
 * - OK give context props to modules
 * - OK give page context
 * - OK give scroll context
 * - OK load modules css
 * - OK Permettre à la fonction init d'être async
 * - modules can depth: 'scroll'
 * - take transition types back here
 * - modules lazy load?
 * - make this work in smaller frames than the full window ?
 * - Possible d'avoir un auto refresh de la page quand on save le module externe ?
 * - Juste une remarque sur le nombre de recours à la fonction update au lancement
 * - Les erreurs qui s'affichent en "module load errrors" directement dans le html du module sont difficiles à débugguer, possible de les avoir dans la console ? Ces erreurs correspondent à des soucis de syntaxe débile et la ligne n'est pas affichée... 
 * - Les blocs fixes sans layouts nommés devraient être à 100% de largeur par défaut ?
 */

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
export type BlockDataFixedHTMLPartial = BlockDataFixedDepthPartial & BlockDataHTMLTypePartial
export type BlockDataFixedModulePartial = BlockDataFixedDepthPartial & BlockDataModuleTypePartial & { trackScroll?: boolean }

export type BlockDataCommonProperties = {
  content?: string
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
type BlockKey = string|BlockData

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

type PagesScrollDataMap = Map<number, {
  ref: HTMLDivElement|null
  height?: number
  progression?: number
  scrolled?: number
}>

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
  cssFilesUrlDataMap?: Map<string, string>
}

/* Actual Component */
export default class Scrollgneugneu extends Component<Props, State> {
  state: State = {}
  constructor (props: Props) {
    super(props)
    this.topDetection = this.topDetection.bind(this)
    this.cntDetection = this.cntDetection.bind(this)
    this.btmDetection = this.btmDetection.bind(this)

    this.loadCss = this.loadCss.bind(this)
    this.getBgColorTransitionDuration = this.getBgColorTransitionDuration.bind(this)
    this.getThresholdBarRect = this.getThresholdBarRect.bind(this)
    this.throttledGetThresholdBarRect = this.throttledGetThresholdBarRect.bind(this)

    this.getExploitablePages = this.getExploitablePages.bind(this)
    this.doesPageNeedScrollTracking = this.doesPageNeedScrollTracking.bind(this)

    this.getBlockCurrentStatus = this.getBlockCurrentStatus.bind(this)
    this.getBlockKey = this.getBlockKey.bind(this)
    this.getFixedBlockDataFromKey = this.getFixedBlockDataFromKey.bind(this)
    this.getFixedBlockPages = this.getFixedBlockPages.bind(this)
    
    this.getAllFixedBlocks = this.getAllFixedBlocks.bind(this)
    this.getDedupedFixedBlocks = this.getDedupedFixedBlocks.bind(this)
    this.getZSortedFixedBlocks = this.getZSortedFixedBlocks.bind(this)
    this.dryUpdateFixedBlockContext = this.dryUpdateFixedBlockContext.bind(this)
    this.dryUpdateFixedBlocksContexts = this.dryUpdateFixedBlocksContexts.bind(this)
    this.updateFixedBlocksContexts = this.updateFixedBlocksContexts.bind(this)
    this.observeFixedBlocks = this.observeFixedBlocks.bind(this)
    this.unobserveFixedBlocks = this.unobserveFixedBlocks.bind(this)
    this.handleFixedBlocksResize = this.handleFixedBlocksResize.bind(this)
    this.FixedBlocks = this.FixedBlocks.bind(this)

    this.handlePageChange = this.handlePageChange.bind(this)
    this.ScrollBlocks = this.ScrollBlocks.bind(this)

    this.getFixedBlockCurrentDisplayZone = this.getFixedBlockCurrentDisplayZone.bind(this)
    this.getFixedBlocksCurrentDisplayZones = this.getFixedBlocksCurrentDisplayZones.bind(this)
    this.getDisplayZoneProgression = this.getDisplayZoneProgression.bind(this)
    this.handleWindowScroll = this.handleWindowScroll.bind(this)
    this.handlePaginatorResize = this.handlePaginatorResize.bind(this)
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

  /* * * * * * * * * * * * * * * * * * * * * *
   * SCRLGNGN POSITION DETECTION IN WINDOW
   * * * * * * * * * * * * * * * * * * * * * */

  /** Saves in state if the top of the scrllgngn wrapper is in screen */
  topDetection ({ isIntersecting }: IntersectionObserverEntry) { this.setState({ topVisible: isIntersecting }) }
  /** Saves in state if the content of the scrllgngn wrapper is in screen */
  cntDetection ({ isIntersecting }: IntersectionObserverEntry) { this.setState({ cntVisible: isIntersecting }) }
  /** Saves in state if the bottom of the scrllgngn wrapper is in screen */
  btmDetection ({ isIntersecting }: IntersectionObserverEntry) { this.setState({ btmVisible: isIntersecting }) }

  /* * * * * * * * * * * * * * * * * * * * * *
   * LOAD CSS
   * * * * * * * * * * * * * * * * * * * * * */

  /**
   * Loads a CSS file from url and stores data in state,
   * if something goes wrong, the loading is retried
   * up to three times (500ms delay) before giving up
   */
  loadCssAttemptsMap = new Map<string, number>()
  async loadCss (url: string): Promise<void> {
    const {
      loadCss,
      loadCssAttemptsMap,
      state
    } = this
    const alreadyLoadedData = state.cssFilesUrlDataMap?.get(url)
    if (alreadyLoadedData !== undefined) return
    const attemptsCnt = loadCssAttemptsMap.get(url) ?? 0
    if (attemptsCnt >= 3) return
    loadCssAttemptsMap.set(url, attemptsCnt + 1)
    try {
      const requestResponse = await window.fetch(url)
      const responseData = await requestResponse.text()
      this.setState(curr => {
        const currCssFilesMap = curr.cssFilesUrlDataMap
        const newCssFilesMap = new Map(currCssFilesMap ?? [])
        newCssFilesMap.set(url, responseData)
        return { ...curr, cssFilesUrlDataMap: newCssFilesMap }
      })
    } catch (err) {
      window.setTimeout(() => loadCss(url), 500)
    }
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

  paginatorRef: Paginator|null = null
  /**
   * Returns the threshold bar bounding client rect 
   * from the Scrollgngn's underlying Paginator component
   */
   getThresholdBarRect () {
    const { paginatorRef } = this
    if (paginatorRef === null) return
    const rect = paginatorRef.getThresholdBarBoundingClientRect()
    return rect
  }

  /** Throttles Scrllgngn.getThresholdBarRect with a 500ms delay */
  throttledGetThresholdBarRect = throttle<typeof this.getThresholdBarRect>(
    this.getThresholdBarRect.bind(this),
    500
  ).throttled

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
   * GET BLOCK KEY
   * * * * * * * * * * * * * * * * * * * * * */
  getBlockKey (blockData: BlockData): BlockKey {
    const idInBlockData = 'id' in blockData
    if (!idInBlockData) return blockData
    const { id } = blockData
    if (id === undefined) return blockData
    return id
  }

  /* * * * * * * * * * * * * * * * * * * * * *
   * GET FIXED BLOCK DATA FROM KEY
   * * * * * * * * * * * * * * * * * * * * * */
  getFixedBlockDataFromKey (blockKey: BlockKey): BlockDataFixed|undefined {
    const {
      getDedupedFixedBlocks,
      getBlockKey
    } = this
    const dedupedFixedBlocks = getDedupedFixedBlocks()
    return dedupedFixedBlocks.find(blockData => getBlockKey(blockData) === blockKey)
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
   * DRY UPDATE FIXED BLOCKS CONTEXTS
   * * * * * * * * * * * * * * * * * * * * * */
  dryUpdateFixedBlockContext (
    query: FixedBlockDryContextUpdationQuery,
    currentContextsMap: State['fixedBlocksContextMap']
  ): Map<BlockKey, BlockContext> {
    const { key: blockKey, updation } = query
    const newContexts = currentContextsMap !== undefined
      ? new Map(currentContextsMap)
      : new Map<BlockKey, BlockContext>()
    const currentBlockContext = currentContextsMap?.get(blockKey)
    if (currentBlockContext === undefined) newContexts.set(blockKey, createBlockContext(updation))
    else newContexts.set(blockKey, {
      ...currentBlockContext,
      ...updation
    })
    return newContexts
  }

  dryUpdateFixedBlocksContexts (
    queries: FixedBlockDryContextUpdationQuery[],
    currentContextsMap: State['fixedBlocksContextMap']
  ): Map<BlockKey, BlockContext> {
    const { dryUpdateFixedBlockContext } = this
    const newContextsMap = queries.reduce((acc, curr) => {
      const newMap = dryUpdateFixedBlockContext(curr, acc)
      return newMap
    }, currentContextsMap ?? new Map<BlockKey, BlockContext>())
    return newContextsMap
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
        fixedBlocksPContextMap: currContext !== undefined
          ? new Map(currContext)
          : new Map<BlockKey, BlockContext>()
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
        fixedBlocksPContextMap: currContext !== undefined
          ? new Map(currContext)
          : new Map<BlockKey, BlockContext>()
      }
    })
  }

  /** The store for fixed blocks refs after they are rendered */
  fixedBlocksKeysToRefsMap: Map<BlockKey, HTMLDivElement| null> = new Map()

  /* * * * * * * * * * * * * * * * * * * * * *
   * GENERATE DISPLAYED FIXED BLOCKS
   * * * * * * * * * * * * * * * * * * * * * */
  FixedBlocks () {
    const {
      state,
      getZSortedFixedBlocks,
      getBlockCurrentStatus,
      loadCss,
      getBlockKey,
      fixedBlocksKeysToRefsMap
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
      const key = getBlockKey(blockData)
      // Context
      const blockContext = state.fixedBlocksContextMap?.get(key)
      const blockPrevContext = state.fixedBlocksPContextMap?.get(key)
      return <div
        key={key}
        ref={n => { fixedBlocksKeysToRefsMap.set(key, n) }}
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
   * FIXED BLOCKS RESIZE OBSERVATION
   * * * * * * * * * * * * * * * * * * * * * */

  /** The resize observer that handles fixed blocks resize events  */
  fixedBlocksResizeObserver = new ResizeObserver(e => this.handleFixedBlocksResize(e))

  /** Takes all fixed blocks refs currently stored, and attach them to the resize observer */
  observeFixedBlocks () {
    const { fixedBlocksKeysToRefsMap, fixedBlocksResizeObserver } = this
    const fixedBlocksRefs = Array.from(fixedBlocksKeysToRefsMap.values())
    fixedBlocksRefs.forEach(ref => {
      if (ref === null) return
      fixedBlocksResizeObserver.observe(ref)
    })
  }

  /** Disconnects the fixed blocks resize observer */
  unobserveFixedBlocks () {
    const { fixedBlocksResizeObserver } = this
    fixedBlocksResizeObserver.disconnect()
  }

  /**
   * For each resized entry (fixed block wrapper node), find the
   * associated fixed block unique key via Scrollgngn.fixedBlocksKeysToRefsMap
   * (see Scrllgngn.getBlockKey), get the wrapper node's width and height
   * from ResizeObserverEntry.contentRect, and update accordingly the fixed blocks
   * contexts properties of Scrllgngn.state
   */
  handleFixedBlocksResize (entries: ResizeObserverEntry[]) {
    const {
      fixedBlocksKeysToRefsMap,
      dryUpdateFixedBlocksContexts,
      updateFixedBlocksContexts,
      state
    } = this
    const keysToRefsArr = [...fixedBlocksKeysToRefsMap.entries()]
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
   * HANDLE PAGE CHANGE
   * * * * * * * * * * * * * * * * * * * * * */
  handlePageChange (paginatorState: PaginatorState) {
    const { coming, active, passed } = paginatorState
    const {
      getDedupedFixedBlocks,
      getFixedBlockPages,
      getBlockKey,
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
      const blockKey = getBlockKey(fixedBlockData)
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
      const fixedBlocksContextMap = new Map(newFixedBlocksContextMap)
      const fixedBlocksPContextMap = curr.fixedBlocksContextMap !== undefined
        ? new Map(curr.fixedBlocksContextMap)
        : new Map<BlockKey, BlockContext>()
      return {
        ...curr,
        currentPagePos: newCurrentPagePos,
        previousPagePos: curr.currentPagePos,
        fixedBlocksContextMap,
        fixedBlocksPContextMap
      }
    })
  }

  scrollingBlocksPosToRefsMap: Map<number, HTMLDivElement|null> = new Map()

  /* * * * * * * * * * * * * * * * * * * * * *
   * GENERATE DISPLAYED SCROLLING BLOCKS
   * * * * * * * * * * * * * * * * * * * * * */
  ScrollBlocks () {
    const {
      props,
      getExploitablePages,
      loadCss,
      scrollingBlocksPosToRefsMap,
      handlePageChange
    } = this
    const exploitablePages = getExploitablePages()
    return <Paginator
      thresholdOffset={props.thresholdOffset}
      onPageChange={handlePageChange}
      ref={(n: Paginator) => { this.paginatorRef = n }}>
      {exploitablePages?.map((pageData, pagePos) => (
        <Paginator.Page
          pageRef={n => { scrollingBlocksPosToRefsMap.set(pagePos, n) }}
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

  /**
   * Returns the current display zone of a fixed block, which
   * is an array of consecutive pages positions including the current
   * in which the fixed block should be displayed. If the fixed block
   * is not supposed to be displayed in the current page, the display
   * zone is an empty array
   */
   getFixedBlockCurrentDisplayZone (blockData: BlockDataFixed) {
    const {
      state,
      getBlockKey,
      getFixedBlockPages
    } = this
    const blockKey = getBlockKey(blockData)
    const { currentPagePos } = state
    if (currentPagePos === undefined) return {
      key: blockKey,
      displayZone: []
    }
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
      if (lastPos === undefined) return // Not really possible since displayZone = [currentPagePos]
      if (pagePos - lastPos === 1) displayZone.push(pagePos)
    })
    return {
      key: blockKey,
      displayZone
    }
  }

  /** Returns the current display zones of ALL fixed blocks */
  getFixedBlocksCurrentDisplayZones () {
    const { getDedupedFixedBlocks } = this
    const dedupedFixedBlocks = getDedupedFixedBlocks()
    return dedupedFixedBlocks.map(this.getFixedBlockCurrentDisplayZone)
  }

  getDisplayZoneProgression (
    displayZone: number[],
    pagesScrollDataMap: PagesScrollDataMap
  ) {
    const { state } = this
    const { currentPagePos } = state
    if (currentPagePos === undefined) return
    const displayZoneScrolledData = displayZone.reduce((acc, pagePos) => {
      const pageProgressionData = pagesScrollDataMap.get(pagePos)
      if (pageProgressionData === undefined) return acc
      let scrolled = 0
      if (pagePos < currentPagePos) scrolled = pageProgressionData.height ?? 0
      else if (pagePos === currentPagePos) scrolled = pageProgressionData.scrolled ?? 0 
      return {
        scrolled: acc.scrolled + scrolled,
        height: acc.height + (pageProgressionData.height ?? 0)
      }
    }, { scrolled: 0, height: 0 })
    const { scrolled, height } = displayZoneScrolledData
    let progression = scrolled / height
    if (progression < 0) progression = 0
    if (progression > 1) progression = 1
    return progression
  }

  /* * * * * * * * * * * * * * * * * * * * * *
   * HANDLE WINDOW SCROLL
   * * * * * * * * * * * * * * * * * * * * * */
  handleWindowScroll () {
    const {
      state,
      getExploitablePages,
      scrollingBlocksPosToRefsMap,
      doesPageNeedScrollTracking,
      dryUpdateFixedBlocksContexts,
      getFixedBlockDataFromKey,
      getFixedBlocksCurrentDisplayZones
    } = this
    
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
    const thresholdBarRect = this.throttledGetThresholdBarRect().returnValue
    if (thresholdBarRect === undefined) return

    // Pages progression data
    const { top: thresholdBarTop } = thresholdBarRect
    const scrollingBlocksPosToRefsArr = [...scrollingBlocksPosToRefsMap.entries()]
    const pagesScrollDataMap: PagesScrollDataMap = new Map()
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
    const fixedBlocksKeysWithDisplayZone = getFixedBlocksCurrentDisplayZones()
    if (fixedBlocksKeysWithDisplayZone === undefined) return
    const scrollTrackingFixedBlocksWithDisplayZone = fixedBlocksKeysWithDisplayZone.filter(({ key }) => {
      const blockData = getFixedBlockDataFromKey(key)
      return (
        blockData !== undefined
        && 'trackScroll' in blockData
        && blockData.trackScroll === true)
    })
    const fixedBlocksUpdateQueries: FixedBlockDryContextUpdationQuery[] = []
    scrollTrackingFixedBlocksWithDisplayZone.forEach(({ key: blockKey, displayZone }) => {
      const progression = this.getDisplayZoneProgression(displayZone, pagesScrollDataMap)
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
    // Get scroll panel zIndex
    const zSortedFixedBlocks = getZSortedFixedBlocks()
    const scrollPanelZIndex = zSortedFixedBlocks
      .filter(blockWithZ => blockWithZ.blockData.depth === 'back')
      .length
    // Detect if blocks are fixed or not
    const { topVisible, cntVisible, btmVisible } = state
    const blocksAreFixed = cntVisible === true && topVisible !== true && btmVisible !== true
    const offsetFixed = !blocksAreFixed && btmVisible
    // Gather loaded css from modules
    const loadedCssNoUndefMap = state.cssFilesUrlDataMap ?? new Map<string, string>()
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
