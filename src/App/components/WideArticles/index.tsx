import { Component, JSX } from 'preact'
import clss from 'classnames'
import './styles.css'

interface Props {
  className?: string
  style?: JSX.CSSProperties
}

class WideArticles extends Component<Props, {}> {
  mainClass: string = 'frag-wide-articles'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this
    const classes: string = clss(this.mainClass, props.className)
    const inlineStyle = { ...props.style }

    return (
      <div className={classes} style={inlineStyle}>
        TSX component WideArticles.
      </div>
    )
  }
}

export type { Props }
export default WideArticles
