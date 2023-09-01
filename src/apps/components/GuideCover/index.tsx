import { Component, JSX, VNode } from 'preact'
import Paginator, { State as PaginatorState } from '../../../modules/components/Paginator'
import bem from '../../../modules/utils/bem'
import Cover from './Cover'
import InfoText from '../InfoText'
import './styles.scss'

type Props = {
  title?: string | VNode,
  intro?: string | VNode,
}

type State = {
  currentPage?: number
}

export const className = bem('mondial-guide-cover-wrapper')

export default class GuideCover extends Component<Props, State> {
  state: State = {
    currentPage: undefined
  }

  constructor(props: Props) {
    super(props)
    this.handlePageChange = this.handlePageChange.bind(this)
  }

  handlePageChange(e: PaginatorState) {
    this.setState({ currentPage: e.value })
  }

  render(): JSX.Element {
    const { props } = this

    // Assign classes and styles
    const wrapperStyle: JSX.CSSProperties = {
      '--height': '100vh',
      '--step-height': '500px',
    }

    // Display
    return <>
      <div style={wrapperStyle}>
        <div className={className.value}>
          <Cover currentStep={this.state.currentPage} title={this.props.title} intro={this.props.intro} />
        </div>
        {/* <Paginator
          thresholdOffset='100%'
          onPageChange={this.handlePageChange}
          style={{ position: 'relative', marginTop: 'calc(-1 * var(--height))', zIndex: 1 }}>
          <Paginator.Page value={0}>
            <div style={{ height: 'calc(var(--height))', backgroundColor: 'transparent' }}></div>
          </Paginator.Page>
          <Paginator.Page value={1}>
            <div style={{ height: 'var(--step-height)', backgroundColor: 'transparent' }}></div>
          </Paginator.Page>
        </Paginator> */}
      </div>
    </>
  }
}
