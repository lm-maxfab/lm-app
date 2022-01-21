import { Component, JSX } from 'preact'
import wrapper, { InjectedProps } from '../../wrapper'
import bem from '../../modules/le-monde/utils/bem'
import './styles.scss'
import ChapterHead from '../components/ChapterHead'
import Home from '../components/Home'
import ChapterRow from '../components/ChapterRow'
import { HomeData, ChapterData, ImageBlockData, ConsolidatedChapterData } from '../types'

import fakeData from './fakeData'
import Paginator from '../../modules/le-monde/components/Paginator'

interface Props extends InjectedProps {}
interface State {
  currentPage: any
  currentChapter: any
  currentChapterRow: any
}

class Longform extends Component<Props, State> {
  static clss: string = 'illus21-longform'
  clss = Longform.clss
  state: State = {
    currentPage: null,
    currentChapter: null,
    currentChapterRow: null
  }

  constructor (props: Props) {
    super(props)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleChapterChange = this.handleChapterChange.bind(this)
    this.handleChapterRowChange = this.handleChapterRowChange.bind(this)
  }

  handlePageChange (val: any) { this.setState({ currentPage: val }) }
  handleChapterChange (val: any) { this.setState({ currentChapter: val }) }
  handleChapterRowChange (val: any) { this.setState({ currentChapterRow: val }) }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    // Retrieve data
    const homeData = (props.sheetBase.collection('home').entry('1').value as unknown as HomeData)
    const chaptersData = (props.sheetBase.collection('chapters').value as unknown as ConsolidatedChapterData[])
    const imageBlocksData = (props.sheetBase.collection('image_blocks').value as unknown as ImageBlockData[])

    // imageBlocksData.forEach(imageBlock => {
    //   const chapterPos = imageBlock.chapter_number
    //   const rowPos = imageBlock.row_number
    //   const blockPos = imageBlock.position_in_row
    //   if (chapterPos === undefined
    //     || rowPos === undefined
    //     || blockPos === undefined) return
    //   const chapter = chaptersData[chapterPos]
    //   if (chapter === undefined) return
    //   if (!Array.isArray(chapter.rows)) chapter.rows = []
    //   if (!Array.isArray(chapter.rows[chapterPos])) chapter.rows[chapterPos] = []
    //   chapter.rows[chapterPos][blockPos] = imageBlock
    // })

    console.log(chaptersData)

    // chaptersData.forEach(chapterData => {
    //   const sortedRows = chapterData.rows?.map(row => {
    //     return row.filter(e => e !== undefined)
    //   })
    //   chapterData.rows = sortedRows
    // })

    // Assign classes
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      marginTop: 'var(--len-nav-height)'
    }

    // Display
    return (
        <div
          style={wrapperStyle}
          className={wrapperClasses.value}>
          <Paginator
            triggerBound='bottom'
            onPageChange={this.handlePageChange}>
            
            {/* HOME */}
            <Paginator.Page value='home'>
              <div className={bem(this.clss).elt('home').value}>
                <Home
                  bgImageUrl={homeData.bg_image_url}
                  bgSize={homeData.bg_size}
                  bgPosition={homeData.bg_position}
                  bgOpacity={homeData.bg_opacity}
                  title={homeData.title}
                  kicker={homeData.kicker} />
              </div>
            </Paginator.Page>
            
            {/* INTRO */}
            <Paginator.Page value='intro'>
              <div className={bem(this.clss).elt('intro').value}>
                <ChapterHead kicker={homeData.intro} />
              </div>
            </Paginator.Page>

            {/* CHAPTERS */}
            <Paginator.Page value='chapters'>
              <div className={bem(this.clss).elt('chapters').value}>
                <Paginator
                  triggerBound='bottom'
                  onPageChange={this.handleChapterChange}>
                  
                  {/* CHAPTER */}
                  {chaptersData.map(chapter => {
                    console.log(chapter)
                    return <Paginator.Page value={`chapter-${chapter.id}`}>
                      <div className={bem(this.clss).elt('chapter').value}>

                        {/* CHAPTER HEAD */}
                        <div className={bem(this.clss).elt('chapter-head').value}>
                          <ChapterHead
                            title={chapter.title}
                            kicker={chapter.kicker}
                            className={bem(this.clss).elt('chapter-head').value} />
                        </div>

                        {/* CHAPTER ROWS */}
                        <Paginator
                          triggerBound='bottom'
                          onPageChange={this.handleChapterRowChange}>

                          {/* CHAPTER ROW */}
                          {chapter.rows?.map((row, rowPos) => {
                            return <Paginator.Page value={`row-${rowPos}`}>
                              <div className={bem(this.clss).elt('chapter-row').value}>
                                <ChapterRow blocks={row} />
                              </div>
                            </Paginator.Page>
                          })}

                        </Paginator>                        
                      </div>
                    </Paginator.Page>
                  })}
                </Paginator>
              </div>
            </Paginator.Page>

            {/* CREDITS */}
            <Paginator.Page value='credits'>
              <div className={bem(this.clss).elt('credits').value}>
                <ChapterHead kicker='Crédits' />
              </div>
            </Paginator.Page>
          </Paginator>
        </div>
    )
  }
}

export type { Props, Longform }
export default wrapper(Longform)
