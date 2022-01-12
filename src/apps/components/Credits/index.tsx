import { Component, JSX } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'
import { CreditsContentData } from '../../types'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  content?: CreditsContentData['content']
}

class Credits extends Component<Props, {}> {
  static clss = 'prn-credits'
  clss = Credits.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Classes and style */
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    /* Display */
    return (
      <div className={wrapperClasses.value} style={wrapperStyle}>
        {props.content}
      </div>
    )
  }
}

export type { Props }
export default Credits
