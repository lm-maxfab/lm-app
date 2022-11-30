import { Component, JSX } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'
import { ImageBlockData, MonthData } from '../../types'
import ImageBlock from '../ImageBlock'
import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  month?: MonthData
  blocks?: ImageBlockData[]
}

class Months extends Component<Props, {}> {
  clss = 'photos22-month'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Logic */

    /* Classes and style */
    const classes = bem(props.className ?? '').block(this.clss)
    const inlineStyle: JSX.CSSProperties = { ...props.style }

    /* Display */
    if (props.month === undefined
      || props.blocks === undefined
      || props.blocks.length === 0) return null
    
    return (
      <div className={classes.value} style={inlineStyle}>
        <h2 className={bem(this.clss).elt('title').value}>
          {props.month.name}
        </h2>
        <div className={bem(this.clss).elt('blocks').value}>
          {props.blocks.map(block => <ImageBlock data={block} />)}
        </div>
      </div>
    )
  }
}

export type { Props }
export default Months
