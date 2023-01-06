import { Component } from 'preact'
import styles from './styles.module.scss'
import TransitionsWrapper from './TransitionsWrapper'
import BlockRenderer from './BlockRenderer'
import IntersectionObserverComponent from '../../components/IntersectionObserver'
import ResizeObserverComponent from '../../components/ResizeObserver'

export type LayoutName = 'left-half'|'right-half'
export type TransitionName = 'fade'|'grow'|'whirl'|'slide-up'|'right-open'|'left-open'
export type TransitionDuration = string|number
export type TransitionDescriptor = [TransitionName]|[TransitionName, TransitionDuration]

/* Props stuff */
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

/* Context stuff */

type BlockContext = {
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
  _displayZones: BlockDisplayZone[],
  _context: BlockContext
  _pContext: BlockContext
}

type StatePageData = PropsPageData & {
  _blocksIds: Set<BlockIdentifier>
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
    cssUrlDataMap: new Map()
  }
  
  static getDerivedStateFromProps (
    props: Props,
    state: State
  ): State|null {
    const { getStateBlocksFromProps } = Scrollgneugneu
    const { prevPropsPages } = state
    if (props.pages === prevPropsPages) return null
    const newStateBlocks = getStateBlocksFromProps(props.pages ?? [], state)
    const newStatePages = new Map<number, StatePageData>()
    props.pages?.forEach((pageData, pagePos) => {
      const pageBlocksIds = new Set<BlockIdentifier>()
      pageData.blocks?.forEach(blockData => {
        const blockIdentifier = this.getBlockIdentifier(blockData)
        pageBlocksIds.add(blockIdentifier)
      })
      newStatePages.set(pagePos, {
        ...pageData,
        _blocksIds: pageBlocksIds
      })
    })
    const newState = {
      ...state,
      pages: newStatePages,
      blocks: newStateBlocks,
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
        const zIndex = zIndexes.get(blockIdentifier) ?? 0
        const displayZones = getBlockDisplayZones(blockIdentifier, pagesData)
        const context = currentStateBlocks.get(blockIdentifier)?._context ?? createBlockContext({})
        const pContext = currentStateBlocks.get(blockIdentifier)?._pContext ?? createBlockContext({})
        const stateBlockData: StateBlockData = {
          ...blockData,
          _zIndex: zIndex,
          _displayZones: displayZones,
          _context: context,
          _pContext: pContext
        }
        newStateBlocks.set(blockIdentifier, stateBlockData)
      })
    })
    return newStateBlocks
  }

  static getBlockIdentifier (blockData: PropsBlockData) {
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

  static getBlocksZIndexes (pagesData: PropsPageData[]): Map<BlockIdentifier, number> {
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
      .filter(blockData => blockData.depth === 'back')
      .sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0))
    const frontBlocks = dedupedBlocksDataArr
      .filter(blockData => blockData.depth === 'front')
      .sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0))
    const scrollBlocks = dedupedBlocksDataArr
      .filter(blockData => ['scroll', undefined].includes(blockData.depth))
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
    this.handlePaginatorResize = this.handlePaginatorResize.bind(this)
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
  
  stickyBlocksRefsMap: Map<BlockIdentifier, HTMLDivElement|null> = new Map()

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
    const { getLayoutClasses } = Scrollgneugneu
    const {
      state,
      loadCss,
      getBgColorTransitionDuration,
      isBlockSticky,
      getBlockStatus,
      stickyBlocksRefsMap,
      topDetection,
      cntDetection,
      btmDetection,
      handlePaginatorResize
    } = this

    const {
      currPagePos,
      scrollingPanelHeight,
      cssUrlDataMap,
      blocks,
      pages
    } = state
    
    const currPageData = currPagePos !== undefined ? pages.get(currPagePos) : undefined
    // Assign css classes to wrapper
    const wrapperClasses = [styles['wrapper']]
    // if (blocksAreFixed) wrapperClasses.push(styles['wrapper_fix-blocks'])
    // if (offsetFixed) wrapperClasses.push(styles['wrapper_offset-fixed-blocks'])
    
    // Return virtual DOM
    return <div
      className={wrapperClasses.join(' ')}
      style={{
        backgroundColor: currPageData?.bgColor,
        ['--fixed-blocks-height']: '100vh', // [WIP] make this a prop for non fullscreen scrllgngn usage
        ['--scrolling-block-height']: `${scrollingPanelHeight}px`,
        ['--bg-color-transition-duration']: getBgColorTransitionDuration(),
        // ['--scroll-panel-z-index']: scrollPanelZIndex // [WIP] i think we dont need this anymore
      }}>

      {/* MODULES STYLES */}
      {[...cssUrlDataMap.entries()].map(([url, data]) => {
        const oneLineData = data
          .trim()
          .replace(/\s+/igm, ' ')
          .replace(/\n/igm, ' ')
        return <style key={url} data-url={url}>
          {oneLineData}
        </style>
      })}

      {/* STICKY BLOCKS */}
      {[...blocks].map(([blockIdentifier, blockData]) => {
        const blockIsSticky = isBlockSticky(blockIdentifier)
        if (!blockIsSticky) return null
        const {
          type,
          content,
          layout,
          mobileLayout,
          transitions,
          mobileTransitions,
          _zIndex,
          _context,
          _pContext
        } = blockData
        const stickyBlockStatus = getBlockStatus(blockIdentifier)
        const stickyBlockClasses = [
          styles['sticky-block'],
          styles[`status-${stickyBlockStatus}`],
          ...getLayoutClasses(layout, mobileLayout)
        ]
        return <div
          key={blockIdentifier}
          ref={n => { stickyBlocksRefsMap.set(blockIdentifier, n) }}
          className={stickyBlockClasses.join(' ')}
          style={{ ['--z-index']: _zIndex }}>
          <TransitionsWrapper
            isActive={stickyBlockStatus === 'current'}
            transitions={transitions}
            mobileTransitions={mobileTransitions}>
            <BlockRenderer
              type={type}
              content={content}
              context={_context}
              prevContext={_pContext}
              cssLoader={loadCss} />
          </TransitionsWrapper>
        </div>
      })}

      {/* SCROLLING CONTENT */}
      <div className={styles['scroll-panel']}>
        {/* TOP BOUND DETECTION */}
        <IntersectionObserverComponent
          render={<div />}
          callback={topDetection} />
        {/* CONTENT */}
        <IntersectionObserverComponent callback={cntDetection}>
          <ResizeObserverComponent onResize={handlePaginatorResize}>
            <div style={{ height: 3000 }} />
            {/* <ScrollBlocks /> */}
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
