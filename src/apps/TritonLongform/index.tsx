import { Component, JSX } from 'preact'
import Scrollator from '../../modules/layouts/Scrollator'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import './styles.scss'
import { PageData, SettingsData, CustomCssData } from '../types'

interface Props extends InjectedProps {}

class Longform extends Component<Props, {}> {
  static clss: string = 'triton-scrollator'
  clss = Longform.clss

  /* * * * * * * * * * * * * * *
   * LIFECYCLE
   * * * * * * * * * * * * * * */
  componentDidMount () {
    const { sheetBase } = this.props
    const customCssData = (sheetBase?.collection('custom-css').entries[0]?.value ?? {}) as unknown as CustomCssData
    if (customCssData.css === undefined) return
    const head = document.head
    const style = document.createElement('style')
    style.setAttribute('type', 'text/css')
    style.innerText = customCssData.css + '\n.article--longform { overflow: unset !important; }'
    head.append(style)
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    // Logic
    const scrollatorBlocksFilter = (window as any).lm_triton_article_name as string ?? 'article-1'
    const rawPagesData = (props.sheetBase?.collection('scrollator-pages').value ?? []) as unknown as PageData[]
    const pagesData = rawPagesData.filter(block => block.target_article_id === scrollatorBlocksFilter)
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
        thresholdOffset={settingsData?.scrollator_threshold_offset}
        fixedBlocksPanelHeight='100vh' />
    </div>
  }
}

export type { Props, Longform }
export default appWrapper(Longform)
