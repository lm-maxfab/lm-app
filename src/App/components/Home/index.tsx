import { Component, JSX } from 'preact'
import clss from 'classnames'
import Parallax from '../../../modules/le-monde/components/Parallax'
import './styles.css'
import { HomeImage } from '../../types'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  images: HomeImage[]
  activate: boolean
}

class Home extends Component<Props, {}> {
  mainClass: string = 'frag-home'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    // Classes
    const classes = clss(this.mainClass, props.className)
    const inlineStyle: JSX.CSSProperties = { ...props.style }

    const innerVisibilityClass = `${this.mainClass}__inner_visibility-${props.activate}`
    const innerClasses = clss(`${this.mainClass}__inner`, innerVisibilityClass)

    // Display
    return (
      <div className={classes} style={inlineStyle}>
        <Parallax
          render={(percent: number) => {
            const style = { top: `${percent * 100}%` }
            const contentOpacity = percent < (2/3) ? '1' : `${1 / (percent + (1/3))}`
            return <div
              className={innerClasses}
              style={style}>
              <span
                style={{ opacity: contentOpacity }}>
                scrolled {percent}%
              </span>
            </div>
          }} />
      </div>
    )
  }
}

export type { Props }
export default Home
