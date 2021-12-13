import { Component, JSX } from 'preact'
import bem from '../../modules/le-monde/utils/bem'
import wrapper, { InjectedProps } from '../../wrapper'
import Intro from '../components/Intro'
import ChapterCards from '../components/ChapterCards'
import { ChapterData, FooterElementsData } from '../types'

import './styles.scss'

interface Props extends InjectedProps {}

class Footer extends Component<Props, {}> {
  static clss = 'prn-footer'
  clss = Footer.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Logic */
    const footerElements = props.sheetBase.collection('footer_elements').entries[0].value as unknown as FooterElementsData
    const chapters = props.sheetBase.collection('chapters').value as unknown as ChapterData[]

    /* Classes and style */
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    /* Display */
    return (
      <div
        style={wrapperStyle}
        className={wrapperClasses.value}>
        <Intro
          title={footerElements.title}
          paragraph={footerElements.paragraph} />
        <ChapterCards chapters={chapters} />
      </div>
    )
  }
}

export type { Props }
export default wrapper(Footer)
