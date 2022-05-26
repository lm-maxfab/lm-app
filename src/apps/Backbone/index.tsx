import { Component, JSX } from 'preact'
import Scrollator from '../../modules/layouts/Scrollator'
import { PageData, StyleVariantsData, SettingsData, CreditsData } from '../types'
import { SheetBase } from '../../modules/utils/sheet-base'
import ArticleCredits from '../../modules/components/ArticleCredits'

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
    const creditsData = (props.sheetBase?.collection('credits').entries[0]?.value ?? {}) as unknown as CreditsData
    const pagesData = allPagesData.filter(pageData => pageData.destination_slot === props.slotName)

    // Display
    return <>
      <Scrollator
        pagesData={pagesData}
        fixedBlocksPanelHeight='100vh'
        styleVariantsData={styleVariantsData}
        animationDuration={300}
        thresholdOffset={settingsData?.scrollator_threshold_offset} />
      <div style={{
        padding: '40vh 8px',
        backgroundColor: 'black',
        color: 'white',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{ maxWidth: '480px' }}>
          <ArticleCredits content={creditsData.content} />
        </div>
      </div>
    </>
  }
}

export type { Props, Backbone }
export default Backbone
