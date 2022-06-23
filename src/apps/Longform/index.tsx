//test
import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'

import Scrollator from '../../modules/layouts/Scrollator'
import ArticleHeader from '../../modules/components/ArticleHeader'
import ArticleCredits from '../../modules/components/ArticleCredits'

import { PageData, SettingsData, CreditsData, CustomCssData } from '../types'
import './styles.scss'

interface Props extends InjectedProps {}

class Longform extends Component<Props, {}> {
  static clss: string = 'unnamed-longform'
  clss = Longform.clss

  /* * * * * * * * * * * * * * *
   * LIFECYCLE
   * * * * * * * * * * * * * * */
  componentDidMount () {
    const customCssData = (this.props.sheetBase?.collection('custom-css').entries[0]?.value ?? {}) as unknown as CustomCssData
    if (customCssData.css === undefined) return
    const head = document.head
    const style = document.createElement('style')
    style.setAttribute('type', 'text/css')
    style.innerText = customCssData.css
    head.append(style)
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    // Pull data from spreadsheet
    const pagesData = (props.sheetBase?.collection('scrollator-pages').value ?? []) as unknown as PageData[]
    const settingsData = (props.sheetBase?.collection('scrollator-settings').entries[0]?.value ?? {}) as unknown as SettingsData
    const creditsData = (props.sheetBase?.collection('credits').entries[0]?.value ?? {}) as unknown as CreditsData

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      position: 'relative'
    }

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      <ArticleHeader
        className='unnamed-longform__header'
        fill1={'white'}
        fill2={'rgb(255, 255, 255, .3)'} />
      <Scrollator
        pagesData={pagesData}
        fixedBlocksPanelHeight='100vh'
        animationDuration={300}
        thresholdOffset={settingsData?.scrollator_threshold_offset} />
      <ArticleCredits
        className='unnamed-longform__credits-test'
        content={creditsData.content} />
    </div>
  }
}

export type { Props, Longform }
export default appWrapper(Longform)
