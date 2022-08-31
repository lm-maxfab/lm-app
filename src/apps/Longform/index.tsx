import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import './styles.scss'
import Scrollator, { ScrollatorPageData } from '../../modules/layouts/Scrollator'
import P5Thing from '../components/P5Thing'

interface Props extends InjectedProps {}

interface State {
  flow: number
  aperture: number
}

class Longform extends Component<Props, State> {
  static clss: string = 'sable-longform'
  clss = Longform.clss
  state: State = {
    flow: 100,
    aperture: 3
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this
    const longformPagesData = props.sheetBase?.collection('longform-pages').value as unknown as ScrollatorPageData[]

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      <Scrollator
        onPageChange={() => {
          this.setState({
            flow: 100,// Math.random() * 800 + 200,
            aperture: 1// Math.random() * 50
          })
        }}
        _dirtyIntermediateLayer={
          <div style={{ opacity: 1 }}><P5Thing
            height='100vh'
            flow={this.state.flow}
            aperture={this.state.aperture}
            frameRate={60}
            maxSimultaneousGrains={100 * 1000}
            gravity={.05}
            showStats={false} />
          </div>
        }
        thresholdOffset='0%'
        fixedBlocksPanelHeight='100vh'
        pagesData={longformPagesData} />
    </div>
  }
}

export type { Props, Longform }
export default appWrapper(Longform)
