import { Component, JSX } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'
import { MonthData } from '../../types'
import Logo from '../Logo'
import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  data?: MonthData[]
  current?: MonthData['id']
  dispatchMonthButtonClick: (e: string) => void
}

class Nav extends Component<Props, {}> {
  $root: HTMLElement | null = null
  clss = 'photos22-nav'

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR & LIFECYCLE
   * * * * * * * * * * * * * * */
  constructor(props: Props) {
    super(props)
    this.scrollCurrentIntoView = this.scrollCurrentIntoView.bind(this)
  }

  componentDidMount() {
    if (this.props.current !== undefined) {
      this.scrollCurrentIntoView()
    }
  }

  componentDidUpdate(prevProps: Props) {
    const prevMonth = prevProps.current
    const currentMonth = this.props.current
    if (currentMonth !== undefined && prevMonth !== currentMonth) {
      this.scrollCurrentIntoView()
    }
  }

  /* * * * * * * * * * * * * * *
   * METHODS
   * * * * * * * * * * * * * * */
  scrollCurrentIntoView() {
    if (this.$root === null) return
    const currentMonth = this.props.current
    if (currentMonth === undefined) return
    const toScrollIntoView = this.$root.querySelector(`button[data-month-id="${currentMonth}"]`)
    if (toScrollIntoView === null) return
    const { left, right } = toScrollIntoView.getBoundingClientRect()
    const { left: navLeft, right: navRight } = this.$root.getBoundingClientRect()
    const scrollMargin = 56
    if (left - (navLeft + scrollMargin) <= 0) this.$root.scrollBy({ left: left - (navLeft + scrollMargin), behavior: 'smooth' })
    else if (right - (navRight - scrollMargin) > 0) this.$root.scrollBy({ left: right - (navRight - scrollMargin), behavior: 'smooth' })
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render(): JSX.Element | null {
    const { props } = this

    /* Classes and style */
    const classes = bem(props.className ?? '').block(this.clss)
    const innerClasses = bem(this.clss).elt('inner')
    const monthsClasses = bem(this.clss).elt('months')
    const inlineStyle: JSX.CSSProperties = { ...props.style }

    /* Display */
    return (
      <nav
        style={inlineStyle}
        className={classes.value}
        ref={node => { this.$root = node }}>
        <div className={innerClasses.value}>
          <Logo></Logo>
          <div className={monthsClasses.value}>
            <div className={monthsClasses.elt('inner').value}>
              {props.data?.map(month => {
                const monthClasses = bem(this.clss)
                  .elt('month')
                  .mod({ current: month.id === props.current })
                return <button
                  data-month-id={month.id}
                  className={monthClasses.value}
                  onClick={() => this.props.dispatchMonthButtonClick(month.id)}>
                  {month.name}
                </button>
              })}
            </div>
          </div>
        </div>
      </nav>
    )
  }
}

export type { Props }
export default Nav
