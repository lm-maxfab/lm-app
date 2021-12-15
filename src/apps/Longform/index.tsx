import { Component, JSX } from 'preact'
import './styles.scss'
import { SheetBase } from '../../modules/le-monde/utils/sheet-base'
import bem from '../../modules/le-monde/utils/bem'
import getViewportDimensions from '../../modules/le-monde/utils/get-viewport-dimensions'
import Paginator, { Page } from '../../modules/le-monde/components/Paginator'
import Home from '../components/Home'
import Intro from '../components/Intro'
import Destinations from '../components/Destinations'
import Credits from '../components/Credits'
import { Destination as DestinationType, IntroElement } from '../types'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  sheetBase?: SheetBase
}

interface State {
  openedDestinationId: string|null
}

class App extends Component<Props, State> {
  clss: string = 'dest22'
  state: State = {
    openedDestinationId: null
  }

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR & LIFECYCLE
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
    this.handleDestinationOpenerClick = this.handleDestinationOpenerClick.bind(this)
  }

  /* * * * * * * * * * * * * * *
   * HANDLERS
   * * * * * * * * * * * * * * */
  handleDestinationOpenerClick (destId: string) {
    this.setState(curr => {
      const currDestId = curr.openedDestinationId
      return {
        ...curr,
        openedDestinationId: currDestId === destId ? null : destId
      }
    })
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props, state } = this

    // Logic
    const { navHeight } = getViewportDimensions()
    const data = props.sheetBase
    const introElements = (data?.collection('intro_elements').value ?? []) as unknown as IntroElement[]
    const destinations = (data?.collection('destinations').value ?? []) as unknown as DestinationType[]

    // Assign classes
    const wrapperClasses = bem(props.className ?? '').block('lm-app').block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      '--nav-height': `${navHeight}px`,
      marginTop: 'var(--nav-height)'
    }
    const homeClasses = bem(this.clss).elt('home')
    const introClasses = bem(this.clss).elt('intro')
    const destinationClasses = bem(this.clss).elt('destinations')
    const creditsClasses = bem(this.clss).elt('credits')

    // Display
    return (
      <div
        className={wrapperClasses.value}
        style={wrapperStyle}>
        <Paginator
          triggerBound='top'>
          <Page value='home'><div className={homeClasses.value}><Home /></div></Page>
          <Page value='intro'><div className={introClasses.value}><Intro elements={introElements} /></div></Page>
          <Page value='destinations'>
            <div className={destinationClasses.value}>
              <Destinations
                destinations={destinations}
                openedDestinationId={state.openedDestinationId}
                onDestinationOpenerClick={this.handleDestinationOpenerClick} />
            </div>
          </Page>
          <Page value='credits'><div className={creditsClasses.value}><Credits /></div></Page>
        </Paginator>
      </div>
    )
  }
}

export type { Props }
export default App
