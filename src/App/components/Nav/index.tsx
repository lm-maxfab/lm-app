import { Component, JSX } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'
import { MonthData } from '../../types'
import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  data?: MonthData[]
}

class Nav extends Component<Props, {}> {
  clss = 'photos21-nav'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Classes and style */
    const classes = bem(props.className ?? '').block(this.clss)
    const fixedClasses = bem(this.clss).elt('fixed')
    const inlineStyle: JSX.CSSProperties = { ...props.style }

    /* Display */
    return (
      <nav style={inlineStyle} className={classes.value}>
        <div className={bem(this.clss).elt('inner').value}>
          {props.data?.map(month => {
            return <span className={bem(this.clss).elt('month').value}>
              {month.name}
            </span>
          })}
        </div>
      </nav>
    )
  }
}

export type { Props }
export default Nav
