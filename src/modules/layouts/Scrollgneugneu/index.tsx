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
    this.makePagesExploitable = this.makePagesExploitable.bind(this)
  }

  handlePageChange (paginatorState: PaginatorState) {
    this.setState(curr => ({
      ...curr,
      currentPagePos: paginatorState.value as number|undefined,
      previousPagePos: curr.currentPagePos
    }))
  }

  makePagesExploitable (pagesData: PageData[]|undefined): ExploitablePageData[]|undefined {
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

  render () {
    const { props } = this
    const exploitablePages = this.makePagesExploitable(props.pages)
    console.log(exploitablePages)
    return <div className={styles['wrapper']}>
      <div className={styles['bg-slot']}>BACK</div>
      <div className={styles['fg-slot']}>FRONT</div>
      <div className={styles['scroll-slot']}>
        <Paginator onPageChange={this.handlePageChange}>
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
