import { Component, JSX } from 'preact'
import bem from '../../../utils/bem'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  value?: any
  position?: number
}

class Page extends Component<Props, {}> {
  static clss = 'lm-paginator-page'
  clss = Page.clss
  $root: HTMLDivElement|null = null

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
    this.getRect = this.getRect.bind(this)
  }

  /* * * * * * * * * * * * * * *
   * METHODS
   * * * * * * * * * * * * * * */
  getRect (): DOMRect|null {
    if (this.$root === null) return null
    return this.$root.getBoundingClientRect()
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Classes and style */
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    /* Display */
    return (
      <div
        ref={n => { this.$root = n }}
        style={wrapperStyle}
        className={wrapperClasses.value}>
        {props.children}
      </div>
    )
  }
}

export type { Props }
export default Page
