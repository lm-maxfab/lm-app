import { Component } from 'preact'
import Paginator, { State as PaginatorState } from '../../components/Paginator'
import BlockRenderer from './BlockRenderer'
import styles from './styles.module.scss'

type CommonBlockData = {
  type?: 'module'|'html'
  content?: string
}

type ScrollingBlockData = CommonBlockData & {
  depth?: 'scroll'
}

type FixedBlockData = CommonBlockData & {
  depth: 'back'|'front'
  id?: string
  zIndex?: number
}

type ReferenceBlockData = {
  id?: string
}

type ExploitableBlockData = ScrollingBlockData|FixedBlockData
type BlockData = ScrollingBlockData|FixedBlockData|ReferenceBlockData


type PageData = {
  chapterName?: string
  bgColor?: JSX.CSSProperties['backgroundColor']
  data?: any
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
}

export default class Scrollgneugneu extends Component<Props, State> {
  state: State = {}
  constructor (props: Props) {
    super(props)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.getExploitablePages = this.getExploitablePages.bind(this)
    this.getBgColorTransitionDuration = this.getBgColorTransitionDuration.bind(this)
    this.getFixedBlocksNodes = this.getFixedBlocksNodes.bind(this)
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

  getBgColorTransitionDuration (): string {
    const { bgColorTransitionDuration } = this.props
    if (typeof bgColorTransitionDuration === 'number') return `${bgColorTransitionDuration}ms`
    if (typeof bgColorTransitionDuration === 'string') return bgColorTransitionDuration
    return '200ms'
  }

  getFixedBlocksNodes (depth: 'back'|'front'): JSX.Element[]|null {
    const { state, getExploitablePages } = this
    const exploitablePages = getExploitablePages()
    if (exploitablePages === undefined) return null
    const { currentPagePos, previousPagePos } = state
    const currentPageData = currentPagePos !== undefined
      ? exploitablePages[currentPagePos]
      : undefined
    const previousPageData = previousPagePos !== undefined
      ? exploitablePages[previousPagePos]
      : undefined

    const alreadyRenderedIds = new Set<string>()
    const fixedBlocksNodes: JSX.Element[] = []

    const pushNodeFromBlock = (
      blockData: ExploitableBlockData,
      status: 'current'|'previous'|'inactive',
      wrapperClass: string
    ) => {
      if (blockData.depth !== depth) return
      const hasId = blockData.id !== undefined
      if (!hasId) return fixedBlocksNodes.push(<div
        key={blockData}
        className={wrapperClass}
        style={{ zIndex: blockData.zIndex }}>
        <BlockRenderer
          status={status}
          type={blockData.type}
          content={blockData.content} />
      </div>)
      
      const id = blockData.id as string
      const alreadyRendered = alreadyRenderedIds.has(id)
      if (alreadyRendered) return

      alreadyRenderedIds.add(id)
      fixedBlocksNodes.push(<div
        key={id}
        className={wrapperClass}
        style={{ zIndex: blockData.zIndex }}>
        <BlockRenderer
          status={status}
          type={blockData.type}
          content={blockData.content} />
      </div>)
    }

    const blockWrapperClass = styles[depth === 'back'
      ? 'bg-block'
      : 'fg-block'
    ]

    currentPageData?.blocks?.forEach(blockData => pushNodeFromBlock(blockData, 'current', blockWrapperClass))
    previousPageData?.blocks?.forEach(blockData => pushNodeFromBlock(blockData, 'previous', blockWrapperClass))
    exploitablePages
      ?.filter(pageData => pageData !== currentPageData && pageData !== previousPageData)
      .forEach(pageData => {
        pageData.blocks?.forEach(blockData => pushNodeFromBlock(blockData, 'inactive', blockWrapperClass))
      })

    return fixedBlocksNodes
  }

  render () {
    const { props, state } = this
    const exploitablePages = this.getExploitablePages()
    const { currentPagePos } = state
    const currPageData = exploitablePages !== undefined && currentPagePos !== undefined
      ? exploitablePages[currentPagePos]
      : undefined

    return <div
      className={styles['wrapper']}
      style={{
        backgroundColor: currPageData?.bgColor,
        ['--fixed-blocks-height']: props.fixedBlocksHeight ?? '100vh',
        ['--bg-color-transition-duration']: this.getBgColorTransitionDuration()
      }}>
      <div className={styles['bg-slot']}>
        <div className={styles['bg-slot-inner']}>
          {this.getFixedBlocksNodes('back')}
        </div>
      </div>
      <div className={styles['fg-slot']}>
        <div className={styles['fg-slot-inner']}>
          {this.getFixedBlocksNodes('front')}
        </div>
      </div>
      <div className={styles['scroll-slot']}>
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
