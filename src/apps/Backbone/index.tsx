import { Component, JSX } from 'preact'
import Scrollator from '../../modules/layouts/Scrollator'
import { PageData, StyleVariantsData, SettingsData } from '../types'
import { SheetBase } from '../../modules/utils/sheet-base'

interface Props {
  slotName: string
  sheetBase?: SheetBase
}

class Backbone extends Component<Props, {}> {
  render (): JSX.Element {
    const { props } = this

    // Extract data
    const allPagesData = (props.sheetBase?.collection('pages').value ?? []) as unknown as PageData[]
    const styleVariantsData = (props.sheetBase?.collection('style-variants').value ?? []) as unknown as StyleVariantsData[]
    const settingsData = (props.sheetBase?.collection('settings').entries[0]?.value ?? {}) as unknown as SettingsData

    const pagesData = allPagesData.filter(pageData => pageData.destination_slot === props.slotName)

    // Display
    return <Scrollator
      pagesData={pagesData}
      fixedBlocksPanelHeight='100vh'
      styleVariantsData={styleVariantsData}
      animationDuration={300}
      thresholdOffset={settingsData?.scrollator_threshold_offset} />
  }
}

export type { Props, Backbone }
export default Backbone
