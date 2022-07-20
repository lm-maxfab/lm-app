import { Component } from 'preact'
import SimpleStylableTextCard from '../../../components/SimpleStylableTextCard'
import bem from '../../../utils/bem'
import { ScrollatorPageData } from '../'
import './styles.scss'

export interface Props {
  pageData: ScrollatorPageData
}

export default class Slide extends Component<Props, {}> {
  static clss: string = 'lm-layout-scrollator-page'
  clss = Slide.clss

  render () {
    const { props } = this
    const pageStyle: JSX.CSSProperties = {
      '--padding-top': props.pageData.text_block_margin_top,
      '--padding-bottom': props.pageData.text_block_margin_bottom,
      '--justify-content': props.pageData.text_block_position === 'center'
        ? 'center'
        : props.pageData.text_block_position === 'right'
          ? 'flex-end'
          : 'flex-start',
      userSelect: 'none'
    }
    return <div
      style={pageStyle}
      className={bem(this.clss).value}>
      <SimpleStylableTextCard
        content={props.pageData.text_block_content}
        textAlign={props.pageData.text_block_text_align} />
    </div>
  }
}
