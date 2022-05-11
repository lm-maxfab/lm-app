import { Component } from 'preact'
import SimpleStylableTextCard from '../../../components/SimpleStylableTextCard'
import bem from '../../../utils/bem'
import { ScrollatorPageData, ScrollatorStyleVariantData } from '../'
import './styles.scss'

export interface Props {
  pageData: ScrollatorPageData
  styleVariantsData: ScrollatorStyleVariantData[]
}

export default class Slide extends Component<Props, {}> {
  static clss: string = 'lm-layout-scrollator-page'
  clss = Slide.clss

  render () {
    const { props } = this
    const pageStyle: JSX.CSSProperties = {
      '--padding-top': props.pageData.text_block_margin_top ?? '30vh',
      '--padding-bottom': props.pageData.text_block_margin_bottom ?? '30vh',
      '--justify-content': props.pageData.text_block_position === 'center'
        ? 'center'
        : props.pageData.text_block_position === 'right'
          ? 'flex-end'
          : 'flex-start'
    }
    return <div
      style={pageStyle}
      className={bem(this.clss).value}>
      <SimpleStylableTextCard
        content={props.pageData.text_block_content}
        textAlign={props.pageData.text_block_text_align}
        styleVariants={props.styleVariantsData}
        variantNames={props.pageData.text_block_style_variants} />
    </div>
  }
}
