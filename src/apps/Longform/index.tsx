import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import Scrollator from '../../modules/layouts/Scrollator'
import { CreditsData, PageData, StyleVariantsData } from '../types'
import './styles.scss'

interface Props extends InjectedProps {}

class Longform extends Component<Props, {}> {
  static clss: string = 'cdc-longform'
  clss = Longform.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    // Extract data
    const pagesData = (props.sheetBase?.collection('pages').value ?? []) as unknown as PageData[]
    const creditsData = (props.sheetBase?.collection('credits').entry('1').value ?? {}) as unknown as CreditsData
    const styleVariantsData = (props.sheetBase?.collection('style-variants').value ?? []) as unknown as StyleVariantsData[]

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      <div style={{ height: '1000px' }} />
      <Scrollator
        pagesData={pagesData}
        creditsData={creditsData}
        styleVariantsData={styleVariantsData} />
      <div style={{ height: '1000px' }} />
    </div>
  }
}

export type { Props, Longform }
export default appWrapper(Longform)
