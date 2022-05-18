import { Component, JSX } from 'preact'
import Scrollator from '../../modules/layouts/Scrollator'
import { PageData, StyleVariantsData } from '../types'
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

    const pagesData = allPagesData.filter(pageData => pageData.destination_slot === props.slotName)

    // Display
    return <Scrollator
      pagesData={pagesData}
      styleVariantsData={styleVariantsData}
      animationDuration={300} />
  }
}

export type { Props, Backbone }
export default Backbone
