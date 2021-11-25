import { Component, JSX } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'
import { ImageBlockData, MonthData } from '../../types'
import Month from '../Month'
import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  months?: MonthData[]
  blocks?: ImageBlockData[]
}

class Months extends Component<Props, {}> {
  clss = 'photos21-months'

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
        {props.months?.map(month => {
          const blocks = props.blocks?.filter(block => block.month?.id === month.id)
          return <Month
            month={month}
            blocks={blocks} />
        })}
      </div>
    )
  }
}

export type { Props }
export default Months
