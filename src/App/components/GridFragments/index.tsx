import { Component, JSX } from 'preact'
import clss from 'classnames'
import './styles.css'
import { Fragment } from '../../types'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  fragments?: Fragment[]
}

class GridFragments extends Component<Props, {}> {
  mainClass: string = 'frag-grid-fragments'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this
    const classes: string = clss(this.mainClass, props.className)
    const inlineStyle = { ...props.style }

    return (
      <div className={classes} style={inlineStyle}>
        TSX component GridFragments.
      </div>
    )
  }
}

export type { Props }
export default GridFragments
