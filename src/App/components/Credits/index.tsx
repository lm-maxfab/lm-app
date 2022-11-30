import { Component, JSX, VNode } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'
import { MonthData } from '../../types'
import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  content?: VNode
}

class Credits extends Component<Props, {}> {
  clss = 'photos22-credits'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Classes and style */
    const classes = bem(props.className ?? '').block(this.clss)
    const inlineStyle: JSX.CSSProperties = { ...props.style }

    /* Display */
    return (
      <div className={classes.value} style={inlineStyle}>
        <div className={bem(this.clss).elt('inner').value}>
          <div className={bem(this.clss).elt('title').value}>Crédits</div>
          <div className={bem(this.clss).elt('separator').value} />
          <div className={bem(this.clss).elt('content').value}>
            {props.content}
          </div>
        </div>
      </div>
    )
  }
}

export type { Props }
export default Credits
