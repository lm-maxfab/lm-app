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
type BlockData = ExploitableBlockData|ReferenceBlockData


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
  thresholdOffsed?: string
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
    this.getCurrentPageData = this.getCurrentPageData.bind(this)
    this.getBgColorTransitionDuration = this.getBgColorTransitionDuration.bind(this)
  }

  handlePageChange (paginatorState: PaginatorState) {
    this.setState(curr => ({
      ...curr,
      currentPagePos: paginatorState.value as number|undefined,
      previousPagePos: curr.currentPagePos
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

  getCurrentPageData (): ExploitablePageData|undefined
  getCurrentPageData (asExp: undefined): ExploitablePageData|undefined
  getCurrentPageData (asExp: true): ExploitablePageData|undefined
  getCurrentPageData (asExp: false): PageData|undefined
  getCurrentPageData (asExploitable: boolean = true): PageData|undefined {
    // WIP keep first and last active ?
    const pos = this.state.currentPagePos
    if (pos === undefined) return
    if (this.props.pages === undefined) return
    if (asExploitable) {
      const exploitable = this.getExploitablePages()
      if (exploitable === undefined) return
      return exploitable[pos]
    }
    return this.props.pages[pos]
  }

  getBgColorTransitionDuration (): string {
    const { bgColorTransitionDuration } = this.props
    if (typeof bgColorTransitionDuration === 'number') return `${bgColorTransitionDuration}ms`
    if (typeof bgColorTransitionDuration === 'string') return bgColorTransitionDuration
    return '200ms'
  }

  render () {
    const { props } = this
    const exploitablePages = this.getExploitablePages()
    const currPageData = this.getCurrentPageData()

    return <div
      className={styles['wrapper']}
      style={{
        backgroundColor: currPageData?.bgColor,
        ['--fixed-blocks-height']: props.fixedBlocksHeight ?? '100vh',
        ['--bg-color-transition-duration']: this.getBgColorTransitionDuration()
      }}>
      <div className={styles['bg-slot']}>
        <div className={styles['bg-slot-inner']}>
          {currPageData?.blocks
            ?.filter(blockData => 'depth' in blockData && blockData.depth === 'back')
            .map(blockData => {
              const key = ('id' in blockData) ? blockData.id : blockData
              const zIndex = ('zIndex' in blockData) ? blockData.zIndex : undefined
              return <div
                key={key}
                style={{ zIndex }}
                className={styles['bg-block']}>
                <BlockRenderer
                  type={blockData.type}
                  content={blockData.content} />
              </div>
            })
          }
        </div>
      </div>
      <div className={styles['fg-slot']}>
        <div className={styles['fg-slot-inner']}>
          {currPageData?.blocks
            ?.filter(blockData => 'depth' in blockData && blockData.depth === 'front')
            .map(blockData => {
              const key = ('id' in blockData) ? blockData.id : blockData
              const zIndex = ('zIndex' in blockData) ? blockData.zIndex : undefined
              return <div
                key={key}
                style={{ zIndex }}
                className={styles['fg-block']}>
                <BlockRenderer
                  type={blockData.type}
                  content={blockData.content} />
              </div>
            })
          }
        </div>
      </div>
      <div className={styles['scroll-slot']}>
        <Paginator
          thresholdOffset={props.thresholdOffsed}
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
