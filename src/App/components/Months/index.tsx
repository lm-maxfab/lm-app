import { Component, JSX } from 'preact'
import Paginator, { Page } from '../../../modules/le-monde/components/Paginator'
import bem from '../../../modules/le-monde/utils/bem'
import { ImageBlockData, MonthData } from '../../types'
import Month from '../Month'
import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  months?: MonthData[]
  blocks?: ImageBlockData[][]
  dispatchMonthChange: (monthId?: string) => void
}

class Months extends Component<Props, {}> {
  $root: HTMLDivElement|null = null
  clss = 'photos22-months'

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR & LIFECYCLE
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
    this.scrollToMonth = this.scrollToMonth.bind(this)
  }

  /* * * * * * * * * * * * * * *
   * METHODS
   * * * * * * * * * * * * * * */
  scrollToMonth (monthId: MonthData['id']) {
    if (this.$root === null) return
    const targetClasses = '.' + bem(this.clss).elt('month').value + `_month-${monthId}`
    const targetMonth = this.$root.querySelector(targetClasses)
    if (targetMonth === null) return
    const { top } = targetMonth.getBoundingClientRect()
    window.scrollBy({
      top: top + 8,
      behavior: 'smooth'
    })
  }

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
      <div
        ref={node => { this.$root = node }}
        className={classes.value}
        style={inlineStyle}>
        <Paginator
          triggerBound='top'
          onPageChange={props.dispatchMonthChange}>
          {props.months?.map((month, index) => {
            return <Page value={month.id}>
              <div className={bem(this.clss).elt('month').mod(`month-${month.id}`).value}>
                <Month
                  month={month}
                  blocks={props.blocks![index]} />
              </div>
            </Page>
          })}
        </Paginator>
      </div>
    )
  }
}

export type { Props }
export default Months
