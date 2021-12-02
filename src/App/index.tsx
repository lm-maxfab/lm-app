import { Component, JSX } from 'preact'
import './styles.scss'
import { SheetBase } from '../modules/le-monde/utils/sheet-base'
import bem from '../modules/le-monde/utils/bem'
import getViewportDimensions from '../modules/le-monde/utils/get-viewport-dimensions'
import Paginator, { Page } from '../modules/le-monde/components/Paginator'
import Home from './components/Home'
import Intro from './components/Intro'
import Destinations from './components/Destinations'
import { Destination, IntroElement } from './types'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  sheetBase?: SheetBase
}

class App extends Component<Props, {}> {
  clss: string = 'dest22'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    // Logic
    const { navHeight } = getViewportDimensions()
    const data = props.sheetBase
    const introElements = (data?.collection('intro_elements').value ?? []) as unknown as IntroElement[]
    const destinations = (data?.collection('destinations').value ?? []) as unknown as Destination[]

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

    // Display
    return (
      <div
        className={wrapperClasses.value}
        style={wrapperStyle}>
        <Paginator
          triggerBound='top'
          onPageChange={val => console.log(`Page changed: ${val}`)}>
          {/* <Page value='home'>
            <Home
              className={homeClasses.value} />
          </Page> */}
          <Page value='intro'>
            <Intro
              elements={introElements}
              className={introClasses.value} />
          </Page>
          <Page value='destinations'>
            <Destinations
              entries={destinations}
              className={destinationClasses.value} />
          </Page>
        </Paginator>
      </div>
    )
  }
}

export type { Props }
export default App
