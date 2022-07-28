import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import DemoPage from '../../modules/layouts/DemoPage'
import Scrollator from '../../modules/layouts/Scrollator'
import { CustomCssData, PageData, SettingsData } from '../types'
import './styles.scss'

interface Props extends InjectedProps {}

class Longform extends Component<Props, {}> {
  static clss: string = 'master-longform'
  clss = Longform.clss

  /* * * * * * * * * * * * * * *
   * LIFECYCLE
   * * * * * * * * * * * * * * */
  componentDidMount () {
    const allCustomCssData = (this.props.sheetBase?.collection('custom-css').value ?? []) as unknown as CustomCssData[]
    const customCssData = allCustomCssData.map(elt => elt.css).join('\n')
    if (customCssData === '') return
    const head = document.head
    const style = document.createElement('style')
    style.setAttribute('type', 'text/css')
    style.innerText = customCssData
    head.append(style)
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    const pagesData = (props.sheetBase?.collection('scrollator-pages').value ?? []) as unknown as PageData[]
    const settingsData = (props.sheetBase?.collection('scrollator-settings').entries[0]?.value ?? {}) as unknown as SettingsData

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      <Scrollator
        pagesData={pagesData}
        fixedBlocksPanelHeight='100vh'
        animationDuration={300}
        thresholdOffset={settingsData?.scrollator_threshold_offset} />
    </div>
  }
}

export type { Props, Longform }
export default appWrapper(Longform)
