import { Component, JSX } from 'preact'
<<<<<<< HEAD
import wrapper, { InjectedProps } from '../../wrapper'
import bem from '../../modules/le-monde/utils/bem'
import Paginator from '../../modules/le-monde/components/Paginator2'
import Header from '../components/Header'
import Home from '../components/Home'
import ChapterHead from '../components/ChapterHead'
import ChapterRow from '../components/ChapterRow'
import {
  HomeData,
  ChapterData,
  ImageBlockData,
  ConsolidatedChapterData,
  CreditsData
} from '../types'
=======
import GuideCover from '../components/GuideCover'
import InfoText from '../components/InfoText'
import GroupBlock from '../components/Group/GroupBlock'
import ArticleHeader from '../../modules/components/ArticleHeader'
import ArticleCredits from '../../modules/components/ArticleCredits'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import { TeamData, GeneralData } from '../types'
>>>>>>> 1caabc4f63ba4f5f8f08c558dab0e941d71365da
import './styles.scss'

interface Props extends InjectedProps { }
interface State { }

class Longform extends Component<Props, State> {
  static clss: string = 'mondial-longform'
  clss = Longform.clss
<<<<<<< HEAD
  state: State = {
    currentPage: 'init',
    currentChapter: null,
    currentChapterRow: null
  }

  constructor (props: Props) {
    super(props)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleChapterChange = this.handleChapterChange.bind(this)
    this.handleChapterRowChange = this.handleChapterRowChange.bind(this)
  }

  handlePageChange (val: any) { this.setState({ currentPage: val.value }) }
  handleChapterChange (val: any) { this.setState({ currentChapter: val.value }) }
  handleChapterRowChange (val: any) { this.setState({ currentChapterRow: val.value }) }
=======
>>>>>>> 1caabc4f63ba4f5f8f08c558dab0e941d71365da

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
<<<<<<< HEAD
  render (): JSX.Element {
    const { props, state } = this

    // Pull and reorganize data
    const homeData = (props.sheetBase.collection('home').entries[0].value as unknown as HomeData)
    const chaptersData = (props.sheetBase.collection('chapters').value as unknown as ChapterData[])
    const imageBlocksData = (props.sheetBase.collection('image_blocks').value as unknown as ImageBlockData[])
    const creditsData = (props.sheetBase.collection('credits_content').entries[0].value as unknown as CreditsData)
    const cChaptersData: ConsolidatedChapterData[] = [...chaptersData].map((chapter, chapterPos) => {
      const cChapter = (chapter as ConsolidatedChapterData)
      cChapter.rows = []
      const rows = cChapter.rows
      const thisChapterImageBlocks = imageBlocksData.filter(imageBlock => imageBlock.chapter_number === chapterPos + 1)
      thisChapterImageBlocks.forEach(imageBlock => {
        const rowNb = imageBlock.row_number
        if (rowNb === undefined) return
        if (rows[rowNb - 1] === undefined) rows[rowNb - 1] = []
        const row = rows[rowNb - 1]
        const blockPos = imageBlock.position_in_row
        if (blockPos === undefined) return
        row[blockPos - 1] = imageBlock
      })
      return chapter
    })

    // Get current overlay content
    const currentChapter = cChaptersData[state.currentChapter]
    const currentRows = (currentChapter ?? {}).rows
    const currentRow = (currentRows ?? [])[state.currentChapterRow]
    const firstBlockInRow = (currentRow ?? [])[0]
    const bgColor = firstBlockInRow?.bg_color ?? currentChapter?.main_color
    const text1Color = firstBlockInRow?.text_1_color
    const text2Color = firstBlockInRow?.text_2_color

    // console.log(currentChapter?.main_color)
    // console.log(currentRows)
    // console.log(currentRow)
    // console.log('-')
    
=======
  render(): JSX.Element {
    const { props } = this

    const generalData = props.sheetBase?.collection('general').value[0] as unknown as GeneralData

    const teamsData = ((props.sheetBase?.collection('teams').value ?? []) as unknown as TeamData[])

    const groups: string[] = teamsData.map(el => el.group!)
    const groupsData: string[] = groups.filter((el, index) => groups.indexOf(el) === index)

>>>>>>> 1caabc4f63ba4f5f8f08c558dab0e941d71365da
    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      ['--c-mondial-blue']: '#071080',
      ['--c-mondial-green']: '#00A259',
    }

    const className = bem(this.clss)

    // Display
<<<<<<< HEAD
    return (
        <div
          style={wrapperStyle}
          className={wrapperClasses.value}>
          {/* HEADER */}
          <Header className={bem(this.clss).elt('header').value} />

          {/* PAGES */}
          <Paginator
            style={{ zIndex: 1 }}
            thresholdOffset='75%'
            onPageChange={this.handlePageChange}>
            
            {/* HOME */}
            <Paginator.Page value='home'>
              <div className={bem(this.clss).elt('home').value}>
                <Home
                  hideImage={!['init' ,'home', 'intro'].includes(state.currentPage)}
                  playAnimation={['home'].includes(state.currentPage)}
                  bgImageUrl={homeData.bg_image_url}
                  bgImageMobileUrl={homeData.bg_image_mobile_url}
                  bgSize={homeData.bg_size}
                  bgPosition={homeData.bg_position}
                  bgOpacity={homeData.bg_opacity}
                  title={homeData.title}
                  kicker={homeData.kicker}
                  intro={homeData.intro} />
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
                  thresholdOffset='75%'
                  onPageChange={this.handleChapterChange}>
                  
                  {/* CHAPTER */}
                  {cChaptersData.map((chapter, chapterPos) => {
                    return <Paginator.Page value={chapterPos} key={chapterPos}>
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
                          thresholdOffset='75%'
                          onPageChange={this.handleChapterRowChange}>

                          {/* CHAPTER ROW */}
                          {chapter.rows?.map((row, rowPos) => {
                            const shouldShowFixedStuff = state.currentPage === 'chapters'
                              && state.currentChapter !== null
                              && state.currentChapter !== undefined
                              && state.currentChapterRow !== null
                              && state.currentChapterRow !== undefined
                              && chapterPos === state.currentChapter
                              && rowPos === state.currentChapterRow
                            return <Paginator.Page value={rowPos} key={rowPos}>
                              <div className={bem(this.clss).elt('chapter-row').mod({ 'in-screen': shouldShowFixedStuff }).value}>
                                <ChapterRow
                                  loadImages={shouldShowFixedStuff}
                                  showFixedStuff={shouldShowFixedStuff}
                                  blocks={row} />
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
                <ChapterHead kicker={creditsData.content} />
              </div>
            </Paginator.Page>
          </Paginator>
=======
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>

      <ArticleHeader
        fill1='#fff'
        fill2='rgb(255,255,255,0.6)' />

      <GuideCover
        title={generalData.title}
        intro={generalData.intro}
      ></GuideCover>

      <div className={className.elt('wrapper').value}>
        <InfoText content={generalData.infoText} />

        <div>
          {groupsData?.map(group => {
            return <GroupBlock
              group={group}
              groupTitle={generalData.groupTitle ?? 'Poule'}
              cardCTA={generalData.cardCTA ?? 'Voir la fiche'}
              teams={teamsData.filter(el => el.group === group)}
            />
          })}
        </div>

        <div className={className.elt('end').value}>
          <div>
            <p className={className.elt('conclusion').value}>{generalData.conclusion}</p>
            <ArticleCredits
              className={className.elt('credits').value}
              content={generalData.credits}
            ></ArticleCredits>
          </div>
>>>>>>> 1caabc4f63ba4f5f8f08c558dab0e941d71365da
        </div>
      </div>

    </div>
  }
}

export type { Props, Longform }
export default appWrapper(Longform)
