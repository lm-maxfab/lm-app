import { Component, JSX } from 'preact'
import wrapper, { InjectedProps } from '../../wrapper'
import bem from '../../modules/le-monde/utils/bem'
import './styles.scss'
import Paginator from '../../modules/le-monde/components/Paginator'
import LMHeader from '../../modules/le-monde/components/LMHeader'
import ImageFlipper from '../components/ImageFlipper'
import Intro from '../components/Intro'
import Title from '../components/Title'

interface Props extends InjectedProps {}
interface State {
  currentPageValue?: any
}

class Longform extends Component<Props, State> {
  static clss: string = 'covid-longform'
  clss = Longform.clss
  state: State = {
    currentPageValue: 'init'
  }

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
    this.handlePageChange = this.handlePageChange.bind(this)
  }

  /* * * * * * * * * * * * * * *
   * METHODS
   * * * * * * * * * * * * * * */
  handlePageChange (value: any) {
    this.setState({ currentPageValue: value })
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props, state } = this
    const { currentPageValue } = state

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      marginTop: 'var(--len-nav-height)',
      marginBottom: '40000px'
    }

    // Logic
    const showImageFlipper = ['init', 'intro', 'title'].includes(currentPageValue)
    const introIsActive = ['init', 'intro'].includes(currentPageValue)
    const titleIsActive = ['title'].includes(currentPageValue)

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      {/* Header */}
      <div className={bem(this.clss).elt('header-slot').value}>
        <LMHeader />
      </div>

      {/* Image flipper */}
      <div
        style={{ opacity: showImageFlipper ? 1 : 0  }}
        className={bem(this.clss).elt('image-flipper-slot').value}>
        <ImageFlipper />
      </div>

      <Paginator
        onPageChange={this.handlePageChange}>

        {/* Intro */}
        <Paginator.Page value='intro'>
          <div className={bem(this.clss).elt('intro-slot').value}>
            <Intro isActive={introIsActive} />
          </div>
        </Paginator.Page>

        {/* Title */}
        <Paginator.Page value='title'>
          <div className={bem(this.clss).elt('title-slot').value}>
            <Title isActive={titleIsActive} />
          </div>
        </Paginator.Page>

        {/* Chapters */}
        <Paginator.Page value='chapters'>
          <div className={bem(this.clss).elt('chapters-slot').value}>
            Chapters
          </div>
        </Paginator.Page>

        {/* Credits */}
        <Paginator.Page value='credits'>
          <div className={bem(this.clss).elt('credits-slot').value}>
            Credits
          </div>
        </Paginator.Page>
      </Paginator>
    </div>
  }
}

export type { Props, Longform }
export default wrapper(Longform)
