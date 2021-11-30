import { Component, JSX, toChildArray, cloneElement } from 'preact'

interface BoundPositionInScreen {
  fromTop: number
  fromBottom: number
}

interface PositionInScreen {
  top: BoundPositionInScreen
  bottom: BoundPositionInScreen
}

interface Props {
  value?: string|number|null
}

class Page extends Component<Props, {}> {
  value: string|number|null
  $root: any = null
  
  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR & LIFE CYCLE
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
    this.value = props.value ?? null
    this.getBoundingClientRect = this.getBoundingClientRect.bind(this)
    this.getPositionInScreen = this.getPositionInScreen.bind(this)
    this.cloneChildren = this.cloneChildren.bind(this)
  }

  /* * * * * * * * * * * * * * *
   * METHODS
   * * * * * * * * * * * * * * */
  getBoundingClientRect (): DOMRect|null {
    if (this.$root === null) return null
    return this.$root.getBoundingClientRect()
  }

  getPositionInScreen (): PositionInScreen|null {
    const boundingClientRect = this.getBoundingClientRect()
    if (boundingClientRect === null) return null
    const viewportHeight = window.innerHeight
    const { top, bottom } = boundingClientRect
    return {
      top: { fromTop: top, fromBottom: top - viewportHeight },
      bottom: { fromTop: bottom, fromBottom: bottom - viewportHeight }
    }
  }

  cloneChildren (): JSX.Element {
    const children = toChildArray(this.props.children)
    const ref = (node: any) => { this.$root = node }
    if (children.length !== 1) return <span ref={ref}>{children}</span>
    else {
      const child = children[0]
      if (typeof child !== 'object') return <span ref={ref}>{child}</span>
      else if (child.type === Page || typeof child.type === 'string') return cloneElement(child, { ref })
      else return <span ref={ref}>{child}</span>
    }
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    this.value = this.props.value ?? null
    return this.cloneChildren()
  }
}

export type { Props, BoundPositionInScreen, PositionInScreen }
export default Page
