import { Component, JSX } from 'preact'
import './styles.scss'
import { SheetBase } from '../modules/le-monde/utils/sheet-base'
import bem from '../modules/le-monde/utils/bem'
import getViewportDimensions from '../modules/le-monde/utils/get-viewport-dimensions'
import Paginator, { Page } from '../modules/le-monde/components/Paginator'
import Home from './components/Home'
import Intro from './components/Intro'
import Destinations from './components/Destinations'
import DestinationHead from './components/DestinationHead'
import { Destination, IntroElement } from './types'
import DestinationWindow from './components/DestinationWindow'
import DestinationNumber from './components/DestinationNumber'
import DestinationSupertitle from './components/DestinationSupertitle'
import DestinationTitle from './components/DestinationTitle'

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

        {/* <DestinationHead
          position={2}
          data={destinations[0]} /> */}
        <br /><br /><br /><br /><br /><br />
        <br /><br /><br /><br /><br /><br />
        <br /><br /><br /><br /><br /><br />
        <br /><br /><br /><br /><br /><br />
        <br /><br /><br /><br /><br /><br />
        <DestinationHead
          fixedImage={true}
          photoUrl={destinations[0].main_photo_url}
          shape={destinations[0].shape}
          borderColor={destinations[0].contrast_color}
          bgColor={destinations[0].main_color}
          textColor={destinations[0].contrast_color}
          position={3}
          title={destinations[0].title}
          supertitle={destinations[0].supertitle} />

        {/* <DestinationWindow
          fixedImage={true}
          photoUrl={destinations[0].main_photo_url}
          shape={destinations[0].shape} />

        <DestinationNumber
          borderColor='blue'
          bgColor='aliceblue'
          textColor='red'
          value={3} />

        <DestinationSupertitle
          textColor='red'
          content={destinations[0].supertitle ?? ''} />
        
        <DestinationTitle
          textColor='red'
          content={destinations[0].supertitle ?? ''} /> */}

        <br /><br /><br /><br /><br /><br />
        
        {/* KEEP THIS THIS IS THE APP */}
        {/* <Paginator
          triggerBound='top'
          onPageChange={val => console.log(`Page changed: ${val}`)}>
          <Page value='home'>
            <div className={homeClasses.value}>
              <Home />
            </div>
          </Page>
          <Page value='intro'>
            <div className={introClasses.value}>
              <Intro elements={introElements} />
            </div>
          </Page>
          <Page value='destinations'>
            <div className={destinationClasses.value}>
              <Destinations entries={destinations} />
            </div>
          </Page>
        </Paginator> */}
      </div>
    )
  }
}

export type { Props }
export default App
