import { Component } from 'preact'
import Paginator, { State as PaginatorState } from '../../components/Paginator'
import styles from './styles.module.scss'

type HTMLBlockType = {
  type?: 'html'
  content?: string
}

type ModuleBlockType = {
  id: string
  type: 'module'
  content: string
}

type BlockData = (HTMLBlockType|ModuleBlockType) & {}

type ScrollingBlockData = BlockData & {}

type FixedBlockData = BlockData & {
  zIndex?: number
}

export type PageData = {
  bgColor?: string
  value?: any
  scrolling?: ScrollingBlockData
  fixed?: Array<FixedBlockData>
}

type ModuleRenderer = {}

type Props = {
  thresholdOffsed?: string
  fixedBlocksHeight?: string
  pages?: PageData[]
}

type State = {
  currentPageData?: PageData
  previousPageData?: PageData
  renderers: Map<string, ModuleRenderer>
}

export default class Scrollgneugneu extends Component<Props, State> {
  state: State = {
    currentPageData: undefined,
    previousPageData: undefined,
    renderers: new Map<string, ModuleRenderer>()
  }

  constructor (props: Props) {
    super(props)
    this.handlePageChange = this.handlePageChange.bind(this)
  }

  handlePageChange (paginatorState: PaginatorState) {
    const hasPages = paginatorState.active.length
      + paginatorState.coming.length
      + paginatorState.passed.length > 0
    const noneComing = paginatorState.coming.length === 0
    const nonePassed = paginatorState.passed.length === 0
    const noneActive = paginatorState.active.length === 0
    const pages = this.props.pages
    if (hasPages && noneActive && nonePassed) return this.setState(curr => ({
      ...curr,
      currentPageData: pages !== undefined ? pages[0] : undefined,
      previousPageData: curr.currentPageData
    }))
    if (hasPages && noneActive && noneComing) return this.setState(curr => ({
      ...curr,
      currentPageData: pages !== undefined ? pages.at(-1) : undefined,
      previousPageData: curr.currentPageData
    }))
    this.setState(curr => ({
      ...curr,
      currentPageData: paginatorState.value,
      previousPageData: curr.currentPageData
    }))
  }

  render () {
    const { props, state } = this
    const { pages } = props

    return <div
      className={styles['wrapper']}
      style={{
        backgroundColor: state.currentPageData?.bgColor,
        ['--fixed-blocks-height']: props.fixedBlocksHeight ?? '100vh'
      }}>

      {/* BACKGROUND */}
      <div className={styles['bg-fixed']}>
        <div className={styles['bg-fixed-inner']}>
          {pages?.map(pageData => {
            const blocksData = pageData.fixed
              ?.filter(blockData => blockData.zIndex !== undefined && blockData.zIndex < 0)
              .sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0))
            const isCurrentPage = pageData === state.currentPageData
            const isPreviousPage = pageData === state.previousPageData
            const bgFixedBlockStyle = [
              styles['bg-fixed-blocks'],
              isCurrentPage ? styles['bg-fixed-blocks_current'] : '',
              isPreviousPage && !isCurrentPage ? styles['bg-fixed-blocks_previous'] : ''
            ]
            return <div
              key={pageData}
              className={bgFixedBlockStyle.join(' ').trim()}>
              {blocksData?.map((blockData, blockPos) => {
                const blockType = blockData.type
                const blockContent = blockType === 'html' || blockType === undefined
                  ? <div dangerouslySetInnerHTML={{ __html: blockData?.content ?? '' }} />
                  : 'MODULE'
                return <div
                  key={blockData}
                  style={{ zIndex: blockPos }}
                  className={styles['bg-fixed-block']}>
                  {blockContent}
                </div>
              })}
            </div>
          })}
        </div>
      </div>

      {/* FOREGROUND */}
      <div className={styles['fg-fixed']}>
        <div className={styles['fg-fixed-inner']}>
        {pages?.map(pageData => {
            const blocksData = pageData.fixed
              ?.filter(blockData => blockData.zIndex !== undefined && blockData.zIndex > 0)
              .sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0))
            const isCurrentPage = pageData === state.currentPageData
            const isPreviousPage = pageData === state.previousPageData
            const fgFixedBlockStyle = [
              styles['fg-fixed-blocks'],
              isCurrentPage ? styles['fg-fixed-blocks_current'] : '',
              isPreviousPage && !isCurrentPage ? styles['fg-fixed-blocks_previous'] : ''
            ]
            return <div
              key={pageData}
              className={fgFixedBlockStyle.join(' ').trim()}>
              {blocksData?.map((blockData, blockPos) => {
                const blockType = blockData.type
                const blockContent = blockType === 'html' || blockType === undefined
                  ? <div dangerouslySetInnerHTML={{ __html: blockData?.content ?? '' }} />
                  : 'MODULE'
                return <div
                  key={blockData}
                  style={{ zIndex: blockPos }}
                  className={styles['fg-fixed-block']}>
                  {blockContent}
                </div>
              })}
            </div>
          })}
        </div>
      </div>

      {/* SCROLLING */}
      <div className={styles['scrolling']}>
        <Paginator
          thresholdOffset={props.thresholdOffsed}
          onPageChange={this.handlePageChange}>
          {pages?.map(pageData => {
            const blockData = pageData.scrolling
            const blockType = blockData?.type
            const blockContent = blockType === 'html' || blockType === undefined
              ? <div dangerouslySetInnerHTML={{ __html: blockData?.content ?? '' }} />
              : 'MODULE'
            const isCurrentPage = pageData === state.currentPageData
            const isPreviousPage = pageData === state.previousPageData
            const scrollingBlockStyles = [
              styles['scrolling-block'],
              isCurrentPage ? styles['scrolling-block_current'] : '',
              isPreviousPage && !isCurrentPage ? styles['scrolling-block_previous'] : ''
            ]
            return <Paginator.Page
              key={pageData}
              value={pageData}>
              <div className={scrollingBlockStyles.join(' ').trim()}>
                {blockContent}
              </div>
            </Paginator.Page>
          })}
        </Paginator>
      </div>
    </div>
  }
}
