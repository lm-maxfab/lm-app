import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import Scrollator from '../../modules/layouts/Scrollator'
import { CustomCssData, PageData, SettingsData } from '../types'
import './styles.scss'
import ArticleHeader from '../../modules/components/ArticleHeader'

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
    const minifiedCustomCssData = customCssData.split('\n').map(e => e.trim()).join('')
    style.innerText = minifiedCustomCssData
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
      <ArticleHeader
        style={{ position: 'fixed', top: 0, zIndex: 4 }}
        fill1='rgb(0, 0, 0, 1)'
        fill2='rgb(0, 0, 0, .3)' />
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
