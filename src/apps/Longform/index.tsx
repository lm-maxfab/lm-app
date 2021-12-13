import { Component, JSX } from 'preact'
import wrapper, { InjectedProps } from '../../wrapper'
import bem from '../../modules/le-monde/utils/bem'
import StickyHeader from '../components/StickyHeader'
import FixedIntroImage from '../components/FixedIntroImage'
import Intro from '../components/Intro'
import Chapters from '../components/Chapters'
import Credits from '../components/Credits'
import './styles.scss'
import Paginator from '../../modules/le-monde/components/Paginator'
import { ChapterData, CreditsContentData, IntroElementsData } from '../types'

interface Props extends InjectedProps {}
interface State {
  currentPage: string|null
}

class Longform extends Component<Props, State> {
  static clss: string = 'prn-longform'
  clss = Longform.clss
  state: State = {
    currentPage: null
  }

  constructor (props: Props) {
    super(props)
    this.handlePageChange = this.handlePageChange.bind(this)
  }

  handlePageChange (val: any) {
    this.setState(curr => {
      if (curr.currentPage === val) return null
      return { currentPage: val ?? null }
    })
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props, state } = this

    // Logic
    const introElements = props.sheetBase.collection('intro_elements').entries[0].value as unknown as IntroElementsData
    const chapters = props.sheetBase.collection('chapters').value as unknown as ChapterData[]
    const creditsContent = props.sheetBase.collection('credits_content').entries[0].value as unknown as CreditsContentData

    let fixedImageOpacity = 1
    if (state.currentPage === 'dim-bg') fixedImageOpacity = .2
    else if (state.currentPage === 'hide-bg') fixedImageOpacity = 0

    // Assign classes
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    // Display
    return (
      <div
        style={wrapperStyle}
        className={wrapperClasses.value}>
        <StickyHeader />
        <FixedIntroImage img_url={introElements.image_url} opacity={fixedImageOpacity} />
        <Paginator triggerBound='top' onPageChange={this.handlePageChange}>
          <Paginator.Page value='dim-bg'>
            <div className={bem(this.clss).elt('intro-spacer').value} />
          </Paginator.Page>
          <Paginator.Page value='hide-bg'>
            <Intro title={introElements.title} paragraph={introElements.paragraph} />
            <Chapters chaptersData={chapters} />
            <Credits content={creditsContent.content} />
            <div className={bem(this.clss).elt('bottom-spacer').value} />
          </Paginator.Page>
        </Paginator>
      </div>
    )
  }
}

export type { Props, Longform }
export default wrapper(Longform)
