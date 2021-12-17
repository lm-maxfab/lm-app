import { Component, JSX } from 'preact'
import './styles.scss'
import { SheetBase } from '../../modules/le-monde/utils/sheet-base'
import bem from '../../modules/le-monde/utils/bem'
import getViewportDimensions from '../../modules/le-monde/utils/get-viewport-dimensions'
import Img from '../../modules/le-monde/components/Img'
import { GeneralSettingsData } from '../types'
import sideImageUrl from './assets/side-note-img.jpg'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  sheetBase?: SheetBase
}

class SideSnippet extends Component<Props, {}> {
  clss: string = 'dest22-side-snippet'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    // Logic
    const { navHeight } = getViewportDimensions()
    const generalSettings = (props.sheetBase?.collection('general_settings').value ?? [])[0] as unknown as GeneralSettingsData

    // Assign classes
    const wrapperClasses = bem(props.className ?? '').block('lm-app').block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      '--nav-height': `${navHeight}px`
    }

    // Display
    return (
      <div
        className={wrapperClasses.value}
        style={wrapperStyle}>
        <Img src={sideImageUrl} />
        <p>Découvrez 20 destinations où partir en France et en Europe en 2022 dans <a href={generalSettings.longform_url}>un grand format numérique</a></p>
      </div>
    )
  }
}

export type { Props }
export default SideSnippet
