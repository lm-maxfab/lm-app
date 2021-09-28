import { Component, JSX } from 'preact'
import clss from 'classnames'
import './styles.css'

interface Fragment {
  url: string
  h_position: string
  height: string
  width: string
  paragraph_chunk: JSX.Element
}

interface Props {
  className?: string
  style?: JSX.CSSProperties
  fragments: Fragment[]
}

class Intro extends Component<Props, {}> {
  mainClass: string = 'frag-intro'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this
    const classes: string = clss(this.mainClass, props.className)
    const inlineStyle = { ...props.style }

    return (
      <div className={classes} style={inlineStyle}>
        <div className={`${this.mainClass}__paragraph`}>
          <span className={`${this.mainClass}__paragraph-chunk`}>Lorem ipsum dolor.</span>
        </div>
        <div className={`${this.mainClass}__scrollable-background`}>
          {props.fragments.map((fragment: Fragment) => (
            <div className={`${this.mainClass}__fragment-wrapper`}>
              <div
                className={`${this.mainClass}__fragment-image`}
                style={{
                  width: fragment.width,
                  height: fragment.height,
                  left: fragment.h_position,
                  transform: `translateX(calc(-1 * ${fragment.h_position}))`
                }} />
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export type { Props }
export default Intro
