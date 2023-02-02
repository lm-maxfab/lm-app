import { Component } from 'preact'
import styles from './styles.module.scss'
import TransitionsWrapper from './TransitionsWrapper'
import BlockRenderer from './BlockRenderer'
import IntersectionObserverComponent from '../../components/IntersectionObserver'
import ResizeObserverComponent from '../../components/ResizeObserver'
import Paginator, { State as PaginatorState } from '../../components/Paginator'
import { throttle } from '../../utils/throttle-debounce'
import clamp from '../../utils/clamp'
import bem from '../../utils/bem'
import ArticleHeader, { NavItem as ArticleHeaderNavItem } from '../../components/ArticleHeader'
import isFalsy from '../../utils/is-falsy'

// [WIP] - left-half-bottom, -middle, right-, ... need a fix
export type LayoutName = 'full-screen'
  |'left-half'|'left-half-middle'|'left-half-bottom'
  |'right-half'|'right-half-middle'|'right-half-bottom'
export type TransitionName = 'fade'|'grow'|'whirl'|'slide-up'|'right-open'|'left-open'
export type TransitionDuration = string|number
export type TransitionDescriptor = [TransitionName]|[TransitionName, TransitionDuration]

/* Props stuff */
export type PropsBlockData = {
  id?: string
  depth?: 'scroll'|'back'|'front'
  zIndex?: number
  type?: 'html'|'module'
  content?: string
  layout?: LayoutName
  mobileLayout?: LayoutName
  transitions?: TransitionDescriptor[]
  mobileTransitions?: TransitionDescriptor[]
  trackScroll?: boolean
}

export type PropsPageData = {
  id?: string
  showHeader?: boolean
  showNav?: boolean
  headerLogoFill1?: string
  headerLogoFill2?: string
  headerCustomClass?: string
  headerCustomCss?: string
  chapterName?: string
  isChapterHead?: boolean
  bgColor?: JSX.CSSProperties['backgroundColor']
  blocks?: PropsBlockData[]
}

type Props = {
  stickyBlocksLazyLoadDistance?: number
  stickyBlocksViewportHeight?: string
  stickyBlocksOffsetTop?: number
  thresholdOffset?: string
  bgColorTransitionDuration?: string|number
  pages?: PropsPageData[]
  withHeader?: boolean // [WIP] useless, defined in pages
  headerCustomClass?: string
  headerCustomCss?: string
}

/* Context stuff */

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

export function createBlockContext (
  partialContext?: PartialBlockContext
): BlockContext {
  if (partialContext === undefined) return { ...nullContext }
  return { ...nullContext, ...partialContext }
}

export const diffContexts = (
  initialContext: BlockContext,
  newContext: BlockContext) => {
  const returned: Partial<BlockContext> = {}
  Object.entries(newContext).map(([key, val]) => {
    const valFromInitial = (initialContext as any)[key]
    const valFromNew = val
    if (valFromNew !== valFromInitial) (returned as any)[key] = valFromNew
  })
  return returned
}

export function contextsAreEqual (
  contextA: BlockContext,
  contextB: BlockContext
): boolean {
  return Object.keys(contextA).every(_key => {
    const keyInA = _key in contextA
    const keyInB = _key in contextB
    if (!keyInA || !keyInB) return false
    const key = _key as keyof BlockContext
    return contextA[key] === contextB[key]
  })
}

/* Inner component stuff */

type BlockDisplayZone = number[]
type BlockIdentifier = string

function getNeighbourIntegersSeries (_array: number[]|Set<number>): number[][] {
  const result: number[][] = []
  const dedupedIntArray = [...new Set(_array)].filter(num => Number.isInteger(num))
  dedupedIntArray.forEach(num => {
    const numHasAlreadyASerie = result.some(serie => serie.includes(num))
    if (numHasAlreadyASerie) return
    const numSerie = getIntNeighboursInNumbersSet(num, dedupedIntArray)
    result.push(numSerie)
  })
  return result
}

function getIntNeighboursInNumbersSet (
  integer: number,
  _array: number[]|Set<number>
): number[] {
  const dedupedIntArray = [...new Set(_array)].filter(num => Number.isInteger(num))
  if (!dedupedIntArray.includes(integer)) return []
  const result = [integer]
  const lower = dedupedIntArray.filter(num => num < integer).sort((a, b) => b - a)
  const higher = dedupedIntArray.filter(num => num > integer).sort((a, b) => a - b)
  lower.forEach(num => {
    const firstPos = result[0]
    if (firstPos === undefined) return
    if (firstPos - num === 1) result.unshift(num)
  })
  higher.forEach(num => {
    const lastPos = result[result.length - 1] as number|undefined
    if (lastPos === undefined) return
    if (num - lastPos === 1) result.push(num)
  })
  return result
}

/* State stuff */
type StateBlockData = PropsBlockData & {
  _id: string
  _zIndex: number
  _displayZones: BlockDisplayZone[]
  _context: BlockContext
}

type StatePageData = PropsPageData & {
  _blocksIds: Set<BlockIdentifier>
  _trackScroll: boolean
}

type State = {
  pages: Map<number, StatePageData>,
  blocks: Map<BlockIdentifier, StateBlockData>,
  cssUrlDataMap: Map<string, string>
  prevPropsPages?: PropsPageData[]
  currPagePos?: number
  prevPagePos?: number
  topVisible?: boolean
  cntVisible?: boolean
  btmVisible?: boolean
  scrollingPanelHeight?: number
  scrollingPanelWidth?: number
}

/* Actual Component */
export default class Scrollgneugneu extends Component<Props, State> {
  static getDerivedStateFromProps (
    props: Props,
    state: State
  ): State|null {
    const {
      getBlockDisplayZones,
      getBlocksZIndexes,
    } = Scrollgneugneu
    const { prevPropsPages } = state
    if (props.pages === prevPropsPages) return null
    const { blocks: currentStateBlocks } = state
    const blocks = new Map<BlockIdentifier, StateBlockData>()
    const zIndexes = getBlocksZIndexes(props.pages ?? [])
    props.pages?.forEach((pageData, pagePos) => {
      pageData.blocks?.forEach((blockData, blockPos) => {
        const blockIdentifier = blockData.id ?? `${pagePos}-${blockPos}`
        const alreadyInMap = blocks.has(blockIdentifier)
        if (alreadyInMap) return
        const _zIndex = zIndexes.get(blockIdentifier) ?? 0
        const _displayZones = getBlockDisplayZones(blockIdentifier, props.pages ?? [])
        const currentStateBlock = currentStateBlocks.get(blockIdentifier)
        const _context = currentStateBlock?._context ?? createBlockContext()
        const stateBlockData: StateBlockData = {
          ...blockData,
          _id: blockIdentifier,
          _zIndex,
          _displayZones,
          _context
        }
        blocks.set(blockIdentifier, stateBlockData)
      })
    })
    const pages = new Map<number, StatePageData>()
    props.pages?.forEach((pageData, pagePos) => {
      const _blocksIds = new Set<BlockIdentifier>()
      pageData.blocks?.forEach((blockData, blockPos) => {
        const blockIdentifier = blockData.id ?? `${pagePos}-${blockPos}`
        _blocksIds.add(blockIdentifier)
      })
      const _trackScroll = [..._blocksIds].some(id => blocks.get(id)?.trackScroll === true)
      pages.set(pagePos, { ...pageData, _blocksIds, _trackScroll })
    })
    const newState = {
      ...state,
      pages,
      blocks,
      prevPropsPages: props.pages
    }
    return newState
  }

  static getBlockPages (
    blockIdentifier: BlockIdentifier,
    pagesData: PropsPageData[]
  ): number[] {
    const result: number[] = []
    pagesData.forEach((pageData, pagePos) => {
      const pageIncludesBlock = pageData.blocks?.some((blockData, blockPos) => {
        const thisBlockId = blockData.id ?? `${pagePos}-${blockPos}`
        return thisBlockId === blockIdentifier
      })
      if (pageIncludesBlock) result.push(pagePos)
    })
    return result
  }

  static getBlockDisplayZones (
    blockIdentifier: BlockIdentifier,
    pagesData: PropsPageData[]
  ): BlockDisplayZone[] {
    const { getBlockPages } = Scrollgneugneu
    const blockPages = getBlockPages(blockIdentifier, pagesData)
    const displayZones = getNeighbourIntegersSeries(blockPages)
    return displayZones
  }

  static getBlocksZIndexes (
    pagesData: PropsPageData[]
  ): Map<BlockIdentifier, number> {
    const blocksIdentifierToDataMap = new Map<BlockIdentifier, PropsBlockData>()
    pagesData.forEach((pageData, pagePos) => {
      const blocks = pageData.blocks
      blocks?.forEach((blockData, blockPos) => {
        const blockIdentifier = blockData.id ?? `${pagePos}-${blockPos}`
        if (blocksIdentifierToDataMap.has(blockIdentifier)) return
        blocksIdentifierToDataMap.set(blockIdentifier, blockData)
      })
    })
    const backBlocksDataToIdMap = new Map<PropsBlockData, BlockIdentifier>()
    const scrollBlocksDataToIdMap = new Map<PropsBlockData, BlockIdentifier>()
    const frontBlocksDataToIdMap = new Map<PropsBlockData, BlockIdentifier>()
    blocksIdentifierToDataMap.forEach((blockData, blockId) => {
      if (blockData.depth === 'back') backBlocksDataToIdMap.set(blockData, blockId)
      else if (blockData.depth === 'front') frontBlocksDataToIdMap.set(blockData, blockId)
      else scrollBlocksDataToIdMap.set(blockData, blockId)
    })
    const zIndexes = new Map<BlockIdentifier, number>()
    let currentZIndex = 0
    const blocksSorter = (
      a: [PropsBlockData, BlockIdentifier],
      b: [PropsBlockData, BlockIdentifier]
    ) => {
      const aDepth = (a[0].zIndex ?? 0)
      const bDepth = (b[0].zIndex ?? 0)
      return aDepth - bDepth
    }
    const zIndexesFiller = ([_, blockId]: [PropsBlockData, BlockIdentifier]) => {
      zIndexes.set(blockId, currentZIndex)
      currentZIndex ++
    }
    // Back blocks
    Array
      .from(backBlocksDataToIdMap.entries())
      .sort(blocksSorter)
      .forEach(zIndexesFiller)
    // Scroll blocks
    Array
      .from(scrollBlocksDataToIdMap.entries())
      .sort(blocksSorter)
      .forEach(zIndexesFiller)
    // Front blocks
    Array
      .from(frontBlocksDataToIdMap.entries())
      .sort(blocksSorter)
      .forEach(zIndexesFiller)

    return zIndexes
  }

  static getLayoutClasses (
    layout?: LayoutName,
    mobileLayout?: LayoutName
  ): string[] {
    const classes = []
    const hasLayout = layout !== undefined
    const hasMobileLayout = mobileLayout !== undefined
    if (hasLayout) classes.push(styles[`layout-${layout}`])
    if (hasLayout && !hasMobileLayout) classes.push(styles[`layout-mobile-${layout}`])
    if (hasMobileLayout) classes.push(styles[`layout-mobile-${mobileLayout}`])
    return classes
  }

  constructor (props: Props) {
    super(props)
    this.getBgColorTransitionDuration = this.getBgColorTransitionDuration.bind(this)
    this.loadCss = this.loadCss.bind(this)
    this.boundsDetection = this.boundsDetection.bind(this)
    this.getThresholdRect = this.getThresholdRect.bind(this)
    this.throttledGetThresholdRect = this.throttledGetThresholdRect.bind(this)
    this.isBlockSticky = this.isBlockSticky.bind(this)
    this.getBlockStatus = this.getBlockStatus.bind(this)
    this.getBlockDistanceFromDisplay = this.getBlockDistanceFromDisplay.bind(this)
    this.getPagesRects = this.getPagesRects.bind(this)
    this.handlePaginatorResize = this.handlePaginatorResize.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleWindowScroll = this.handleWindowScroll.bind(this)
    this.handleBlockResize = this.handleBlockResize.bind(this)
    this.throttledHandleBlockResize = this.throttledHandleBlockResize.bind(this)
    this.cleanRefsMaps = this.cleanRefsMaps.bind(this)
    this.getCurrentPageData = this.getCurrentPageData.bind(this)
    this.getPreviousPageData = this.getPreviousPageData.bind(this)
    this.navigateToChapter = this.navigateToChapter.bind(this)
    this.Styles = this.Styles.bind(this)
    this.Header = this.Header.bind(this)
    this.StickyBlocks = this.StickyBlocks.bind(this)
    this.ScrollingBlocks = this.ScrollingBlocks.bind(this)
  }

  state: State = {
    pages: new Map(),
    blocks: new Map(),
    cssUrlDataMap: new Map(),
    currPagePos: 0
  }

  boundsDetectionInterval: number|null = null

  componentDidMount(): void {
    const {
      handleWindowScroll,
      cleanRefsMaps,
      throttledBoundsDetection
    } = this
    cleanRefsMaps()
    window.addEventListener('scroll', handleWindowScroll)
    this.boundsDetectionInterval = window.setInterval(throttledBoundsDetection, 2000)
    handleWindowScroll()
  }

  componentDidUpdate(): void {
    const { cleanRefsMaps } = this
    cleanRefsMaps()
  }

  componentWillUnmount(): void {
    const {
      handleWindowScroll,
      boundsDetectionInterval
    } = this
    if (boundsDetectionInterval !== null) window.clearInterval(boundsDetectionInterval)
    window.removeEventListener('scroll', handleWindowScroll)
  }

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
    const alreadyLoadedData = state.cssUrlDataMap.get(url)
    if (alreadyLoadedData !== undefined) return
    const attemptsCnt = loadCssAttemptsMap.get(url) ?? 0
    if (attemptsCnt >= 3) return
    loadCssAttemptsMap.set(url, attemptsCnt + 1)
    try {
      const requestResponse = await window.fetch(url)
      const responseData = await requestResponse.text()
      this.setState(curr => {
        const currCssFilesMap = curr.cssUrlDataMap
        const newCssFilesMap = new Map(currCssFilesMap ?? [])
        newCssFilesMap.set(url, responseData)
        return { ...curr, cssUrlDataMap: newCssFilesMap }
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

  /* * * * * * * * * * * * * * * * * * * * * *
   * SCRLGNGN POSITION DETECTION IN WINDOW
   * * * * * * * * * * * * * * * * * * * * * */
  boundsDetection () {
    const {
      paginatorRef,
      topBoundRef,
      btmBoundRef,
      props
    } = this
    const { stickyBlocksOffsetTop } = props
    const refToStateKeyMap = new Map<
      'topVisible'|'cntVisible'|'btmVisible',
      HTMLDivElement|null>([
      ['topVisible', topBoundRef],
      ['cntVisible', paginatorRef?.$scrollableArea ?? null],
      ['btmVisible', btmBoundRef]
    ])
    const partialState: Partial<State> = {}
    refToStateKeyMap.forEach((ref, stateKey) => {
      if (ref === null) return
      const { y, height } = ref.getBoundingClientRect()
      const { innerHeight } = window
      const isIntersecting = y <= innerHeight && y + height >= (stickyBlocksOffsetTop ?? 0);
      partialState[stateKey] = isIntersecting
    })
    return this.setState(curr => {
      const partialStateEntries = Object.keys(partialState) as (keyof State)[]
      const hasChanges = partialStateEntries.some(key => {
        const val = partialState[key]
        return curr[key] !== val
      })
      if (!hasChanges) return null
      return {
        ...curr,
        ...partialState
      }
    })
  }

  throttledBoundsDetection = throttle(
    this.boundsDetection.bind(this),
    50
  ).throttled

  getThresholdRect () {
    const { paginatorRef } = this
    if (paginatorRef === null) return;
    return paginatorRef.getThresholdBarBoundingClientRect()
  }

  throttledGetThresholdRect = throttle(
    this.getThresholdRect.bind(this),
    1000
  ).throttled

  isBlockSticky (blockIdentifier: BlockIdentifier) {
    const { state } = this
    const { blocks } = state
    const blockData = blocks.get(blockIdentifier)
    if (blockData === undefined) return undefined
    return blockData.depth === 'front'
      || blockData.depth === 'back'
  }

  getBlockStatus (blockIdentifier: BlockIdentifier) {
    const { getCurrentPageData, getPreviousPageData } = this
    const currPageData = getCurrentPageData()
    const prevPageData = getPreviousPageData()
    if (currPageData?._blocksIds.has(blockIdentifier)) return 'current'
    else if (prevPageData?._blocksIds.has(blockIdentifier)) return 'previous'
    else return 'inactive'
  }

  getBlockDistanceFromDisplay (blockIdentifier: BlockIdentifier) {
    const { state } = this
    const { blocks, currPagePos } = state
    if (currPagePos === undefined) return;
    const blockData = blocks.get(blockIdentifier)
    if (blockData === undefined) return;
    const blockPages = blockData._displayZones.flat()
    const pagesDistances = blockPages
      .map(pagePos => Math.abs((pagePos - currPagePos)))
      .sort((a, b) => a - b)
    const nearestPageDistance = pagesDistances[0] as number|undefined
    return nearestPageDistance
  }

  getPagesRects () {
    const { state, pagesRefsMap } = this
    const { pages } = state
    return new Map([...pages].map(([pagePos]) => {
      const pageRef = pagesRefsMap.get(pagePos) ?? undefined
      if (pageRef === undefined) return [pagePos, undefined]
      const pageRect = pageRef.getBoundingClientRect()
      return [pagePos, pageRect]
    }))
  }

  /* * * * * * * * * * * * * * * * * * * * * *
   * HANDLE PAGINATOR RESIZE
   * * * * * * * * * * * * * * * * * * * * * */
  handlePaginatorResize (entries: ResizeObserverEntry[]) {
    const $paginator = entries[0]
    if ($paginator === undefined) return
    const { contentRect } = $paginator
    const { height, width } = contentRect
    this.setState(curr => {
      if (curr.scrollingPanelHeight === height
        && curr.scrollingPanelWidth === width) return null
      return {
        ...curr,
        scrollingPanelHeight: height,
        scrollingPanelWidth: width
      }
    })
  }

  handlePageChange (paginatorState: PaginatorState) {
    const { coming, active, passed } = paginatorState
    const pagesLength = active.length + coming.length + passed.length
    const hasPages = pagesLength > 0
    const noneComing = coming.length === 0
    const nonePassed = passed.length === 0
    const noneActive = active.length === 0
    const isBeforeFirst = hasPages && noneActive && nonePassed
    const isAfterLast = hasPages && noneActive && noneComing
    let newCurrentPagePos: State['currPagePos'] = paginatorState.value as number|undefined
    if (isBeforeFirst) newCurrentPagePos = hasPages ? 0 : undefined
    if (isAfterLast) newCurrentPagePos = hasPages ? pagesLength - 1 : undefined
    return this.setState(curr => {
      const currBlocks = curr.blocks
      const newBlocks = new Map(currBlocks)
      for (let [blockId, blockData] of currBlocks) {
        const currBlockContextPage = blockData._context.page
        const blockPages = blockData._displayZones.flat()
        let newBlockContextPage: number|null = null
        if (newCurrentPagePos === undefined) newBlockContextPage = null
        else {
          const currPagePosInDisplayZone = blockPages.indexOf(newCurrentPagePos)
          if (currPagePosInDisplayZone === -1) newBlockContextPage = null
          else newBlockContextPage = currPagePosInDisplayZone
        }
        if (currBlockContextPage === newBlockContextPage) {
          newBlocks.set(blockId, blockData)
        } else {
          newBlocks.set(blockId, {
            ...blockData,
            _context: {
              ...blockData._context,
              page: newBlockContextPage
            }
          })
        }
      }
      return {
        ...curr,
        currPagePos: newCurrentPagePos,
        prevPagePos: curr.currPagePos,
        blocks: newBlocks
      }
    })
  }

  handleWindowScroll () {
    const {
      getPagesRects,
      throttledGetThresholdRect,
      throttledBoundsDetection,
      getCurrentPageData
    } = this
    throttledBoundsDetection()
    this.setState(curr => {
      const { blocks, pages, currPagePos } = curr
      const displayedScrollTrackingBlocks = new Map([...blocks].filter(([_, blockData]) => {
        const displayZones = blockData._displayZones
        const currentDisplayZone = displayZones.find(dz => currPagePos !== undefined
          ? dz.includes(currPagePos)
          : false
        )
        return blockData.trackScroll
          && currentDisplayZone !== undefined
      }))
      if (displayedScrollTrackingBlocks.size === 0) return null
      const newBlocks = new Map(blocks)
      const currPageData = getCurrentPageData()
      const thresholdRect = throttledGetThresholdRect().returnValue
      // Not possible to calculate progressions
      if (currPagePos === undefined
        || currPageData === undefined
        || currPageData._trackScroll !== true
        || thresholdRect === undefined) return null
      // Progressions calculation
      const pagesRects = getPagesRects()
      const pagesScrollData = new Map([...pagesRects].map(([pos, domRect]) => {
        if (domRect === undefined) return [pos, undefined]
        const rawScrolled = thresholdRect.top - domRect.top
        const rawProgression = rawScrolled / domRect.height
        const progression = clamp(rawProgression, 0, 1)
        const scrolled = clamp(rawScrolled, 0, domRect.height)
        const { height } = domRect
        return [pos, { height, scrolled, progression }]
      }))
      displayedScrollTrackingBlocks.forEach((blockData, blockId) => {
        const currDz = blockData._displayZones.find(dz => dz.includes(currPagePos))
        if (currDz === undefined) return
        const dzProgression = currDz.reduce(
          (acc, curr) => {
            const pageScrollData = pagesScrollData.get(curr)
            if (pageScrollData === undefined) return acc
            const height = acc.height + pageScrollData.height
            const scrolled = acc.scrolled + pageScrollData.scrolled
            const progression = scrolled / height
            return { height, scrolled, progression }
          },
          { height: 0, scrolled: 0, progression: 0 }
        ).progression
        const pageProgression = pagesScrollData.get(currPagePos)?.progression
        newBlocks.set(blockId, {
          ...blockData,
          _context: {
            ...blockData._context,
            progression: dzProgression,
            pageProgression: pageProgression ?? blockData._context.pageProgression
          }
        })
      })
      return { ...curr, blocks: newBlocks }
    })
  }

  handleBlockResize (_: ResizeObserverEntry[]) {
    const { blocksRefsMap } = this
    this.setState(curr => {
      const currBlocks = curr.blocks
      const newBlocks = new Map(currBlocks)
      blocksRefsMap.forEach((blockRef, blockId) => {
        const currBlockData = currBlocks.get(blockId)
        if (currBlockData === undefined) return
        if (blockRef === null) return newBlocks.set(blockId, {
          ...currBlockData,
          _context: {
            ...currBlockData._context,
            width: null,
            height: null
          }
        })
        const { width, height } = blockRef.getBoundingClientRect()
        newBlocks.set(blockId, {
          ...currBlockData,
          _context: {
            ...currBlockData._context,
            width,
            height
          }
        })
      })
      return {
        ...curr,
        blocks: newBlocks
      }
    })
  }

  throttledHandleBlockResize = throttle(
    this.handleBlockResize.bind(this),
    500
  ).throttled

  paginatorRef: Paginator|null = null
  topBoundRef: HTMLDivElement|null = null
  btmBoundRef: HTMLDivElement|null = null
  pagesRefsMap: Map<number, HTMLDivElement|null> = new Map()
  blocksRefsMap: Map<BlockIdentifier, HTMLDivElement|null> = new Map()
  
  cleanRefsMaps () {
    const { pagesRefsMap, blocksRefsMap } = this
    new Map(pagesRefsMap).forEach((pageRef, pagePos) => {
      if (pageRef !== null) return;
      pagesRefsMap.delete(pagePos)
    })
    new Map(blocksRefsMap).forEach((blockRef, blockId) => {
      if (blockRef !== null) return;
      blocksRefsMap.delete(blockId)
    })
  }

  getCurrentPageData () {
    const { state } = this
    const { currPagePos, pages } = state
    return currPagePos !== undefined
      ? pages.get(currPagePos)
      : undefined
  }

  getPreviousPageData () {
    const { state } = this
    const { prevPagePos, pages } = state
    return prevPagePos !== undefined
      ? pages.get(prevPagePos)
      : undefined
  }

  wrapperBemClass = bem('lm-scrllgngn')

  // [WIP] Take back the styles load and display to BlockRenderer 
  Styles () {
    const { state } = this
    const { cssUrlDataMap } = state
    const fullCssStr = Array
      .from(cssUrlDataMap)
      .map(([url, data]) => {
        const cssStr = data
          .trim()
          .replace(/\s+/igm, ' ')
        return `/*${url}*/${cssStr}`
      })
    return <style>{fullCssStr}</style>
  }

  navigateToChapter (chapterName: string) {
    const { state, pagesRefsMap } = this
    const { pages } = state
    const [targetPagePos] = [...pages].find(([_, pageData]) => {
      return pageData.chapterName === chapterName
        && pageData.isChapterHead === true
    }) ?? []
    const targetPageRef = targetPagePos !== undefined
      ? pagesRefsMap.get(targetPagePos)
      : undefined
    if (targetPageRef === null || targetPageRef === undefined) return;
    targetPageRef.scrollIntoView({ behavior: 'smooth' })
  }

  Header () {
    const { props, state, getCurrentPageData } = this
    const { pages } = state
    const currentPageData = getCurrentPageData()
    const {
      headerLogoFill1,
      headerLogoFill2,
      showHeader,
      showNav
    } = (currentPageData ?? {})
    const customClasses = []
    if (!isFalsy(props.headerCustomClass)) customClasses.push(props.headerCustomClass)
    if (!isFalsy(currentPageData?.headerCustomClass)) customClasses.push(currentPageData?.headerCustomClass)
    const customCss = []
    if (!isFalsy(props.headerCustomCss)) customCss.push(props.headerCustomCss)
    if (!isFalsy(currentPageData?.headerCustomCss)) customCss.push(currentPageData?.headerCustomCss)
    return <ArticleHeader
      fill1={headerLogoFill1}
      fill2={headerLogoFill2}
      navItems={[...pages]
        .filter(pagePosAndData => {
          const [_, pageData] = pagePosAndData
          const { chapterName } = pageData
          const chapterNameIsEmpty = isFalsy(chapterName)
          return !chapterNameIsEmpty
        }).reduce((acc, pagePosAndData) => {
        const [_, pageData] = pagePosAndData
        const pageChapterName = pageData.chapterName
        const alreadyInNav = acc.find(navItem => navItem.value === pageChapterName)
        if (alreadyInNav) return acc;
        return [...acc, {
          value: pageChapterName,
          isActive: currentPageData?.chapterName === pageChapterName,
          onClick: pageChapterName !== undefined
            ? _e => this.navigateToChapter(pageChapterName)
            : undefined
        }]
      }, [] as ArticleHeaderNavItem[])}
      hideLogo={showHeader !== true}
      hideNav={showHeader !== true && showNav !== true}
      hideCta={true} // [WIP] CTA not supported yet
      ctaContent={undefined} // [WIP] CTA not supported yet
      ctaOnClick={e => {}} // [WIP] CTA not supported yet
      customClass={customClasses.join(' ')}
      customCss={customCss.join('\n\n')} />
  }

  StickyBlocks () {
    const { getLayoutClasses } = Scrollgneugneu
    const {
      props,
      state,
      blocksRefsMap,
      wrapperBemClass,
      isBlockSticky,
      getBlockStatus,
      getBlockDistanceFromDisplay,
      loadCss,
      throttledHandleBlockResize,
      Header
    } = this
    const { stickyBlocksLazyLoadDistance } = props
    const lazyLoadDistance = stickyBlocksLazyLoadDistance ?? 2
    const { blocks } = state
    const headerZIndex = [...blocks.values()].reduce((acc, curr) => {
      if (curr._zIndex > acc) return curr._zIndex
      return acc
    }, 0)
    const headerBlockClasses = [
      styles['sticky-block'],
      styles['header'],
      wrapperBemClass.elt('header').value
    ]
    const headerBlockStyle = { '--z-index': headerZIndex }
    return <>
      {/* HEADER */}
      {props.withHeader === true && <div
        style={headerBlockStyle}
        className={headerBlockClasses.join(' ')}>
        <Header />
      </div>}
      {/* STICKY BLOCKS */}
      {[...blocks].map(([blockIdentifier, blockData]) => {
        const blockDistance = getBlockDistanceFromDisplay(blockIdentifier)
        if (blockDistance === undefined) return null
        if (blockDistance > lazyLoadDistance) return null
        const blockIsSticky = isBlockSticky(blockIdentifier)
        if (!blockIsSticky) return null
        const {
          type,         content,     layout,
          mobileLayout, transitions, mobileTransitions,
          _zIndex,      _context
        } = blockData
        const blockStatus = getBlockStatus(blockIdentifier)
        const blockBemClass = wrapperBemClass
          .elt('block')
          .mod('sticky')
          .mod(blockStatus)
        const blockClasses = [
          blockBemClass.value,
          styles['sticky-block'],
          styles[`status-${blockStatus}`],
          ...getLayoutClasses(layout, mobileLayout)
        ]
        return <div
            key={blockIdentifier}
            data-id={blockIdentifier}
            ref={n => { blocksRefsMap.set(blockIdentifier, n) }}
            className={blockClasses.join(' ')}
            style={{ '--z-index': _zIndex }}>
            <ResizeObserverComponent
              onResize={throttledHandleBlockResize}>
              <TransitionsWrapper
                isActive={blockStatus === 'current'}
                transitions={transitions}
                mobileTransitions={mobileTransitions}>
                <BlockRenderer
                  type={type}
                  content={content}
                  context={_context}
                  cssLoader={loadCss} />
              </TransitionsWrapper>
            </ResizeObserverComponent>
          </div>
      })}
    </>
  }

  ScrollingBlocks () {
    const { getLayoutClasses } = Scrollgneugneu
    const {
      props,
      state,
      blocksRefsMap,
      pagesRefsMap,
      wrapperBemClass,
      loadCss,
      isBlockSticky,
      getBlockStatus,
      handlePageChange,
      throttledHandleBlockResize
    } = this
    const {
      pages,
      blocks,
      currPagePos,
      prevPagePos
    } = state
    const sortedPagesArr = [...pages].sort(([aPos], [bPos]) => aPos - bPos)
    const lowestScrollingBlockZIndex = [...blocks.entries()]
      .filter(([blockId]) => !isBlockSticky(blockId))
      .reduce((acc, [_, blockData]) => {
        if (blockData._zIndex <= acc) return blockData._zIndex
        return acc
      }, Infinity)
    
    return <Paginator
      thresholdOffset={props.thresholdOffset}
      onPageChange={handlePageChange}
      className={styles['paginator']}
      style={{ '--z-index': lowestScrollingBlockZIndex }}
      ref={(n: Paginator) => { this.paginatorRef = n }}>
      {sortedPagesArr.map(([pagePos, pageData]) => {
        const pageBlocksData = [...pageData._blocksIds]
          .filter(id => !isBlockSticky(id))
          .map(id => blocks.get(id))
          .filter((b): b is StateBlockData => b !== undefined)
        const isCurrent = pagePos === currPagePos
        const isPrevious = pagePos === prevPagePos
        const isInactive = !isCurrent && !isPrevious
        const pageBemClass = wrapperBemClass
          .elt('page')
          .mod({
            current: isCurrent,
            previous: isPrevious,
            inactive: isInactive
          })
        return <Paginator.Page
          value={pagePos}
          className={pageBemClass.value}
          pageRef={n => { pagesRefsMap.set(pagePos, n) }}>{
            pageBlocksData.map(blockData => {
              const { type, content, layout, mobileLayout } = blockData
              const blockStatus = getBlockStatus(blockData._id)
              const blockBemClass = wrapperBemClass
                .elt('block')
                .mod('scrolling')
                .mod(blockStatus)
              const blockClasses = [
                blockBemClass.value,
                styles['scrolling-block'],
                styles[`status-${blockStatus}`],
                ...getLayoutClasses(layout, mobileLayout)
              ]
              return <div
                key={blockData._id}
                data-id={blockData._id}
                className={blockClasses.join(' ')}
                ref={node => blocksRefsMap.set(blockData._id, node)}
                style={{ '--z-index': blockData._zIndex }}>
                <ResizeObserverComponent
                  onResize={throttledHandleBlockResize}>
                  <BlockRenderer
                    type={type}
                    content={content}
                    cssLoader={loadCss} />
                </ResizeObserverComponent>
              </div>
            })
          }</Paginator.Page>
      })}
    </Paginator>
  }

  /* * * * * * * * * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * * * * * * * * */
  render () {
    // [WIP] TOO MANY RENDERS IT SEEMS
    const {
      props,
      state,
      wrapperBemClass,
      throttledBoundsDetection,
      getBgColorTransitionDuration,
      handlePaginatorResize,
      getCurrentPageData,
      Styles,
      StickyBlocks,
      ScrollingBlocks
    } = this
    const {
      stickyBlocksViewportHeight,
      stickyBlocksOffsetTop
    } = props
    const {
      scrollingPanelHeight,
      scrollingPanelWidth,
    } = state
    
    const currPageData = getCurrentPageData()

    // Detect if blocks must be fixed or offset
    const { topVisible, cntVisible, btmVisible } = state
    const blocksShouldStick = cntVisible
      && !(topVisible ?? false)
      && !(btmVisible ?? false)
    const blocksAreOffset = !blocksShouldStick && btmVisible

    // Wrapper CSS classes
    const wrapperClasses = [
      wrapperBemClass
        .mod(`page-${currPageData?.id}`)
        .value,
      styles['wrapper']
    ]
    if (blocksShouldStick) wrapperClasses.push(
      styles['wrapper_stick-blocks'],
      wrapperBemClass.mod('stick-blocks').value
    )
    if (blocksAreOffset) wrapperClasses.push(
      styles['wrapper_offset-blocks'],
      wrapperBemClass.mod('offset-blocks').value
    )
    if (currPageData?.showHeader !== true) wrapperClasses.push(
      styles['wrapper_hide-header'],
      wrapperBemClass.mod('hide-header').value
    )

    // Scroll panel CSS classes
    const scrollPanelBemClass = wrapperBemClass.element('scroll-panel')
    const scrollPanelClasses = [
      scrollPanelBemClass.value,
      styles['scroll-panel']
    ]
    
    // Return virtual DOM
    return <div
      className={wrapperClasses.join(' ')}
      style={{
        '--sticky-blocks-viewport-height': stickyBlocksViewportHeight ?? '100vh',
        '--sticky-blocks-offset-top': `${stickyBlocksOffsetTop ?? 0}px`,
        '--scrolling-block-height': `${scrollingPanelHeight}px`,
        '--scrolling-block-width': `${scrollingPanelWidth}px`,
        '--bg-color-transition-duration': getBgColorTransitionDuration(),
        '--bg-color': currPageData?.bgColor
      }}>

      {/* MODULES STYLES */}
      <Styles />

      {/* STICKY BLOCKS */}
      <StickyBlocks />

      {/* SCROLLING CONTENT */}
      <div className={scrollPanelClasses.join(' ')}>
        {/* TOP BOUND DETECTION */}
        <IntersectionObserverComponent
          render={<div ref={n => { this.topBoundRef = n }} />}
          callback={throttledBoundsDetection} />
        {/* CONTENT */}
        <IntersectionObserverComponent
          callback={throttledBoundsDetection}>
          <ResizeObserverComponent
            onResize={handlePaginatorResize}>
            <ScrollingBlocks />
          </ResizeObserverComponent>
        </IntersectionObserverComponent>
        {/* BOTTOM BOUND DETECTION */}
        <IntersectionObserverComponent
          render={<div ref={n => { this.btmBoundRef = n }} />}
          callback={throttledBoundsDetection} />
      </div>
    </div>
  }
}
