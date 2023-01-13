import { Component } from 'preact'
import styles from './styles.module.scss'
import TransitionsWrapper from './TransitionsWrapper'
import BlockRenderer from './BlockRenderer'
import IntersectionObserverComponent from '../../components/IntersectionObserver'
import ResizeObserverComponent from '../../components/ResizeObserver'
import Paginator, { State as PaginatorState } from '../../components/Paginator'
import { throttle } from '../../utils/throttle-debounce'
import clamp from '../../utils/clamp'

export type LayoutName = 'left-half'|'right-half'
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
  bgColor?: JSX.CSSProperties['backgroundColor']
  blocks?: PropsBlockData[]
}

type Props = {
  thresholdOffset?: string
  bgColorTransitionDuration?: string|number
  pages?: PropsPageData[]
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
  partialContext: PartialBlockContext
): BlockContext {
  return {
    ...nullContext,
    ...partialContext
  }
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
type BlockIdentifier = string|PropsBlockData

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
    const lastPos = result.at(-1)
    if (lastPos === undefined) return
    if (num - lastPos === 1) result.push(num)
  })
  return result
}

/* State stuff */
type StateBlockData = PropsBlockData & {
  _zIndex: number,
  _displayZones: BlockDisplayZone[]
  _context: BlockContext
  _pContext: BlockContext
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
}

/* Actual Component */
export default class Scrollgneugneu extends Component<Props, State> {
  state: State = {
    pages: new Map(),
    blocks: new Map(),
    cssUrlDataMap: new Map(),
    currPagePos: 0
  }
  
  static getDerivedStateFromProps (
    props: Props,
    state: State
  ): State|null {
    const { prevPropsPages } = state
    if (props.pages === prevPropsPages) return null
    const { getStateBlocksFromProps } = Scrollgneugneu
    const blocks = getStateBlocksFromProps(props.pages ?? [], state)
    const pages = new Map<number, StatePageData>()
    props.pages?.forEach((pageData, pagePos) => {
      const _blocksIds = new Set<BlockIdentifier>()
      pageData.blocks?.forEach(propsBlockData => {
        const blockIdentifier = this.getBlockIdentifier(propsBlockData)
        _blocksIds.add(blockIdentifier)
      })
      const _trackScroll = [..._blocksIds].some(blockId => {
        return blocks.get(blockId)?.trackScroll === true
      })
      pages.set(pagePos, {
        ...pageData,
        _blocksIds,
        _trackScroll
      })
    })
    const newState = {
      ...state,
      pages,
      blocks,
      prevPropsPages: props.pages
    }
    return newState
  }

  static getStateBlocksFromProps (
    pagesData: PropsPageData[],
    state: State
  ): State['blocks'] {
    const {
      getBlockIdentifier,
      getBlockDisplayZones,
      getBlocksZIndexes,
    } = Scrollgneugneu
    const { blocks: currentStateBlocks } = state
    const newStateBlocks = new Map<BlockIdentifier, StateBlockData>()
    const zIndexes = getBlocksZIndexes(pagesData)
    pagesData.forEach(pageData => {
      pageData.blocks?.forEach(blockData => {
        const blockIdentifier = getBlockIdentifier(blockData)
        const alreadyInMap = newStateBlocks.has(blockIdentifier)
        if (alreadyInMap) return
        const _zIndex = zIndexes.get(blockIdentifier) ?? 0
        const _displayZones = getBlockDisplayZones(blockIdentifier, pagesData)
        const currentStateBlock = currentStateBlocks.get(blockIdentifier)
        const _context = currentStateBlock?._context ?? createBlockContext({})
        const _pContext = currentStateBlock?._pContext ?? createBlockContext({})
        const stateBlockData: StateBlockData = {
          ...blockData,
          _zIndex,
          _displayZones,
          _context,
          _pContext
        }
        newStateBlocks.set(blockIdentifier, stateBlockData)
      })
    })
    return newStateBlocks
  }

  static getBlockIdentifier (blockData: PropsBlockData|StateBlockData) {
    // [WIP] THIS IS BUGGY
    return blockData.id ?? blockData
  }

  static getBlockPages (
    blockIdentifier: BlockIdentifier,
    pagesData: PropsPageData[]
  ): number[] {
    const { getBlockIdentifier } = Scrollgneugneu
    const result: number[] = []
    pagesData.forEach((pageData, pagePos) => {
      const pageIncludesBlock = pageData.blocks?.some(blockData => {
        return getBlockIdentifier(blockData) === blockIdentifier
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
    const { getBlockIdentifier } = Scrollgneugneu
    const blocksIdentifierToDataMap = new Map<BlockIdentifier, PropsBlockData>()
    pagesData.forEach(pageData => {
      const blocks = pageData.blocks
      blocks?.forEach(blockData => {
        const blockIdentifier = getBlockIdentifier(blockData)
        if (blocksIdentifierToDataMap.has(blockIdentifier)) return
        blocksIdentifierToDataMap.set(blockIdentifier, blockData)
      })
    })
    const dedupedBlocksDataArr = [...blocksIdentifierToDataMap.values()]
    const backBlocks = dedupedBlocksDataArr
      .filter(blk => blk.depth === 'back')
      .sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0))
    const frontBlocks = dedupedBlocksDataArr
      .filter(blk => blk.depth === 'front')
      .sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0))
    const scrollBlocks = dedupedBlocksDataArr
      .filter(blk => ['scroll', undefined].includes(blk.depth))
      .sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0))
    const zIndexes = new Map<BlockIdentifier, number>()
    let currentZIndex = 0
    backBlocks.forEach(blockData => {
      const blockIdentifier = getBlockIdentifier(blockData)
      zIndexes.set(blockIdentifier, currentZIndex)
      currentZIndex ++
    })
    scrollBlocks.forEach(blockData => {
      const blockIdentifier = getBlockIdentifier(blockData)
      zIndexes.set(blockIdentifier, currentZIndex)
      currentZIndex ++
    })
    frontBlocks.forEach(blockData => {
      const blockIdentifier = getBlockIdentifier(blockData)
      zIndexes.set(blockIdentifier, currentZIndex)
      currentZIndex ++
    })
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
    this.isBlockSticky = this.isBlockSticky.bind(this)
    this.getBlockStatus = this.getBlockStatus.bind(this)
    this.topDetection = this.topDetection.bind(this)
    this.cntDetection = this.cntDetection.bind(this)
    this.btmDetection = this.btmDetection.bind(this)
    this.getThresholdRect = this.getThresholdRect.bind(this)
    this.throttledGetThresholdRect = this.throttledGetThresholdRect.bind(this)
    this.getPagesRects = this.getPagesRects.bind(this)
    this.handlePaginatorResize = this.handlePaginatorResize.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleWindowScroll = this.handleWindowScroll.bind(this)
    this.handleBlockResize = this.handleBlockResize.bind(this)
    this.throttledHandleBlockResize = this.throttledHandleBlockResize.bind(this)
    this.Styles = this.Styles.bind(this)
    this.FixedBlocks = this.FixedBlocks.bind(this)
    this.ScrollingBlocks = this.ScrollingBlocks.bind(this)
  }

  componentDidMount(): void {
    const { handleWindowScroll } = this
    window.addEventListener('scroll', this.handleWindowScroll)
    handleWindowScroll()
  }

  componentWillUnmount(): void {
    window.removeEventListener('scroll', this.handleWindowScroll)
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

  isBlockSticky (blockIdentifier: BlockIdentifier) {
    const { state } = this
    const { blocks } = state
    const blockData = blocks.get(blockIdentifier)
    if (blockData === undefined) return undefined
    return blockData.depth === 'front'
      || blockData.depth === 'back'
  }

  getBlockStatus (blockIdentifier: BlockIdentifier) {
    const { state } = this
    const { currPagePos, prevPagePos } = state
    const currPageData = currPagePos !== undefined ? state.pages.get(currPagePos) : undefined
    const prevPageData = prevPagePos !== undefined ? state.pages.get(prevPagePos) : undefined
    if (currPageData?._blocksIds.has(blockIdentifier)) return 'current'
    else if (prevPageData?._blocksIds.has(blockIdentifier)) return 'previous'
    else return 'inactive'
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

  getThresholdRect () {
    const { paginatorRef } = this
    if (paginatorRef === null) return;
    return paginatorRef.getThresholdBarBoundingClientRect()
  }

  throttledGetThresholdRect = throttle(
    this.getThresholdRect.bind(this),
    1000
  ).throttled

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
    const { height } = contentRect
    this.setState(curr => {
      if (curr.scrollingPanelHeight === height) return null
      return {
        ...curr,
        scrollingPanelHeight: height
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
            },
            _pContext: blockData._context
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
      throttledGetThresholdRect
    } = this
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
      const currPageData = currPagePos !== undefined ? pages.get(currPagePos) : undefined
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
          },
          _pContext: blockData._context
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
      console.log('=====')
      console.log(blocksRefsMap)
      blocksRefsMap.forEach((blockRef, blockId) => {
        const currBlockData = currBlocks.get(blockId)
        // console.log(blockId)
        // console.log(blockRef)
        // console.log(currBlockData)
        // console.log('-')
        if (currBlockData === undefined) return
        if (blockRef === null) return newBlocks.set(blockId, {
          ...currBlockData,
          _context: {
            ...currBlockData._context,
            width: null,
            height: null
          },
          _pContext: currBlockData._context
        })
        const { width, height } = blockRef.getBoundingClientRect()
        newBlocks.set(blockId, {
          ...currBlockData,
          _context: {
            ...currBlockData._context,
            width,
            height
          },
          _pContext: currBlockData._context
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
  pagesRefsMap: Map<number, HTMLDivElement|null> = new Map()
  blocksRefsMap: Map<BlockIdentifier, HTMLDivElement|null> = new Map()

  Styles () {
    const { state } = this
    const { cssUrlDataMap } = state
    return <>{[...cssUrlDataMap.entries()].map(([url, data]) => {
      const cssStr = data
        .trim()
        .replace(/\s+/igm, ' ')
        .replace(/\n/igm, ' ')
      return <style key={url}>{cssStr}</style>
    })}</>
  }

  FixedBlocks () {
    const { getLayoutClasses } = Scrollgneugneu
    const {
      state,
      isBlockSticky,
      getBlockStatus,
      blocksRefsMap,
      loadCss,
      throttledHandleBlockResize
    } = this
    const { blocks } = state
    return <>
      {[...blocks].map(([blockIdentifier, blockData]) => {
        const blockIsSticky = isBlockSticky(blockIdentifier)
        if (!blockIsSticky) return null
        const {
          type,         content,     layout,
          mobileLayout, transitions, mobileTransitions,
          _zIndex,      _context,    _pContext
        } = blockData
        const blockStatus = getBlockStatus(blockIdentifier)
        const blockClasses = [
          styles['sticky-block'],
          styles[`status-${blockStatus}`],
          ...getLayoutClasses(layout, mobileLayout)
        ]
        return <div
            key={blockIdentifier}
            ref={n => { blocksRefsMap.set(blockIdentifier, n) }}
            className={blockClasses.join(' ')}
            style={{ ['--z-index']: _zIndex }}>
            <ResizeObserverComponent onResize={throttledHandleBlockResize}>
              <TransitionsWrapper
                isActive={blockStatus === 'current'}
                transitions={transitions}
                mobileTransitions={mobileTransitions}>
                <BlockRenderer
                  type={type}
                  content={content}
                  context={_context}
                  prevContext={_pContext}
                  cssLoader={loadCss} />
              </TransitionsWrapper>
            </ResizeObserverComponent>
          </div>
      })}
    </>
  }

  ScrollingBlocks () {
    const {
      getBlockIdentifier,
      getLayoutClasses
    } = Scrollgneugneu
    const {
      props,
      state,
      blocksRefsMap,
      pagesRefsMap,
      loadCss,
      isBlockSticky,
      getBlockStatus,
      handlePageChange,
      throttledHandleBlockResize
    } = this
    const { pages, blocks } = state
    const sortedPagesArr = [...pages].sort(([aPos], [bPos]) => aPos - bPos)
    return <Paginator
      thresholdOffset={props.thresholdOffset}
      onPageChange={handlePageChange}
      ref={(n: Paginator) => { this.paginatorRef = n }}>
      {sortedPagesArr.map(([pagePos, pageData]) => {
        const pageBlocksData = [...pageData._blocksIds]
          .filter(id => !isBlockSticky(id))
          .map(id => blocks.get(id))
          .filter((b): b is StateBlockData => b !== undefined)
        return <Paginator.Page
          value={pagePos}
          pageRef={n => { pagesRefsMap.set(pagePos, n) }}>{
            pageBlocksData.map(blockData => {
              const { type, content, layout, mobileLayout } = blockData
              const blockIdentifier = getBlockIdentifier(blockData)
              const blockStatus = getBlockStatus(blockIdentifier)
              const blockClasses = [
                styles['scrolling-block'],
                styles[`status-${blockStatus}`],
                ...getLayoutClasses(layout, mobileLayout)
              ]
              return <div
                className={blockClasses.join(' ')}
                ref={node => blocksRefsMap.set(blockIdentifier, node)}
                style={{ ['--z-index']: blockData._zIndex }}>
                <ResizeObserverComponent onResize={throttledHandleBlockResize}>
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
    const {
      state,
      topDetection,
      cntDetection,
      btmDetection,
      getBgColorTransitionDuration,
      handlePaginatorResize,
      Styles,
      FixedBlocks,
      ScrollingBlocks
    } = this
    const {
      currPagePos,
      scrollingPanelHeight,
      pages
    } = state
    
    const currPageData = currPagePos !== undefined
      ? pages.get(currPagePos)
      : undefined

    // Detect if blocks are fixed or not
    const { topVisible, cntVisible, btmVisible } = state
    const blocksAreFixed = cntVisible
      && !(topVisible ?? false)
      && !(btmVisible ?? false)
    const offsetFixed = !blocksAreFixed && btmVisible

    // Assign css classes to wrapper
    const wrapperClasses = [styles['wrapper']]
    if (blocksAreFixed) wrapperClasses.push(styles['wrapper_fix-blocks'])
    if (offsetFixed) wrapperClasses.push(styles['wrapper_offset-fixed-blocks'])
    
    // Return virtual DOM
    return <div
      className={wrapperClasses.join(' ')}
      style={{
        backgroundColor: currPageData?.bgColor,
        ['--fixed-blocks-height']: '100vh', // [WIP] make this a prop for non fullscreen scrllgngn usage
        ['--scrolling-block-height']: `${scrollingPanelHeight}px`,
        ['--bg-color-transition-duration']: getBgColorTransitionDuration()
      }}>

      {/* MODULES STYLES */}
      <Styles />

      {/* STICKY BLOCKS */}
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
            <ScrollingBlocks />
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
