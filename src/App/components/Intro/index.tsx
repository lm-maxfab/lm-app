import { Component, JSX } from 'preact'
import clss from 'classnames'
import IntersectionObserverComponent from '../../../modules/le-monde/components/IntersectionObserver'
import './styles.css'

type IO = IntersectionObserver
type IOE = IntersectionObserverEntry

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
  paragraph_basis: JSX.Element
}

interface State {
  current_fragment: number|null
}

class Intro extends Component<Props, State> {
  mainClass: string = 'frag-intro'
  state = {
    current_fragment: null
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props, state } = this
    
    // Logic
    const currentFragment = state.current_fragment
    const paragraph = props.fragments
      .slice(0, (currentFragment ?? -1) + 1)
      .map(fragment => <span className={`${this.mainClass}__paragraph-chunk`}>
        {fragment.paragraph_chunk}
      </span>)

    // Classes
    const classes: string = clss(this.mainClass, props.className)
    const inlineStyle = { ...props.style }

    // Display
    return (
      <div className={classes} style={inlineStyle}>
        {/* Sticky paragraph */}
        <div className={`${this.mainClass}__paragraph`}>
          <span className={`${this.mainClass}__paragraph-chunk`}>
            {props.paragraph_basis}
          </span>
          {paragraph}
        </div>
        {/* Int-obs for no current fragment detection */}
        <IntersectionObserverComponent
          callback={(ioEntry: IOE|null) => {
            if (ioEntry?.isIntersecting !== true) return
            this.setState({ current_fragment: null })
          }}
          render={() => <div />} />
        {/* Fragments */}
        <div className={`${this.mainClass}__scrollable-background`}>
          {props.fragments.map((fragment: Fragment, fragmentPos: number) => (
            <IntersectionObserverComponent
              key={fragmentPos}
              threshold={[.6]}
              callback={(ioEntry: IOE|null) => {
                if (ioEntry?.isIntersecting !== true) return
                this.setState({ current_fragment: fragmentPos })
              }}
              render={(ioEntry: IOE|null) => (
                <div className={`${this.mainClass}__fragment-wrapper`}>
                  <div
                    className={`${this.mainClass}__fragment-image`}
                    style={{
                      width: `${Math.random() * 30 + 20}%`,
                      height: fragment.height,
                      left: fragment.h_position,
                      transform: `translateX(calc(-1 * ${fragment.h_position}))`,
                      backgroundColor: ioEntry?.isIntersecting ? 'violet' : 'coral'
                    }} />
                </div>
              )} />
          ))}
        </div>
      </div>
    )
  }
}

export type { Props, State, Fragment }
export default Intro
