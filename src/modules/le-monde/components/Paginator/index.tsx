import { Component, JSX, toChildArray, cloneElement } from 'preact'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  delay?: number
}

interface State {
  activePagePos: number|null
}

class Paginator extends Component<Props, State> {
  lastChildrenLoopTime: number|null = null
  nextChildrenLoopTimeout: number|null = null
  childrenLoopInterval: number|null = null
  childrenRefs: any[] = []
  state: State = {
    activePagePos: null
  }

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR & LIFE CYCLE
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
    this.childrenLoop = this.childrenLoop.bind(this)
    this.requestChildrenLoop = this.requestChildrenLoop.bind(this)
  }

  componentDidMount () {
    this.requestChildrenLoop()
    window.addEventListener('scroll', this.requestChildrenLoop)
    window.addEventListener('resize', this.requestChildrenLoop)
    // [WIP], maybe restore this later if needed, or toggle via props...
    // this.childrenLoopInterval = window.setInterval(this.requestChildrenLoop, 500)
  }

  componentDidUpdate () {
    this.requestChildrenLoop()
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.requestChildrenLoop)
    window.removeEventListener('resize', this.requestChildrenLoop)
    if (this.nextChildrenLoopTimeout !== null) {
      window.clearTimeout(this.nextChildrenLoopTimeout)
      this.nextChildrenLoopTimeout = null
    }
    if (this.childrenLoopInterval !== null) {
      window.clearInterval(this.childrenLoopInterval)
      this.childrenLoopInterval = null
    }
  }

  /* * * * * * * * * * * * * * *
   * METHODS
   * * * * * * * * * * * * * * */
  childrenLoop () {
    console.log('LOOP')
    this.nextChildrenLoopTimeout = null
    this.lastChildrenLoopTime = Date.now()
    const viewportHeight = window.innerHeight
    const intersectingRefs = this.childrenRefs.map((childRef: any) => {
      if (childRef === null || childRef === undefined) return
      if (typeof childRef.getBoundingClientRect !== 'function') return
      const boundingClientRect = childRef.getBoundingClientRect()
      if (boundingClientRect === null || boundingClientRect === undefined) return
      const { top, height } = (boundingClientRect as DOMRect)
      const childTopAboveBottom = viewportHeight - top > 0
      const childBottomBelowBottom = viewportHeight - (top + height) <= 0
      if (childTopAboveBottom && childBottomBelowBottom) return {
        ref: childRef,
        boundingClientRect
      }
    }).filter(e => e !== undefined) as Array<{ ref: any; boundingClientRect: DOMRect }>
    const maxTop = Math.max(...intersectingRefs.map(e => e.boundingClientRect.top))
    const nearestRefs = intersectingRefs.filter(e => e.boundingClientRect.top === maxTop).map(e => e.ref)
    const nearestRef = nearestRefs.slice(-1)[0]
    const nearestRefPos = this.childrenRefs.indexOf(nearestRef)
    console.log(this.state.activePagePos, nearestRefPos)
    if (this.state.activePagePos === nearestRefPos) return
    this.setState({ activePagePos: nearestRefPos })
    // this.setState(curr => {
    //   console.log(curr.activePagePos, nearestRefPos)
    //   if (curr.activePagePos === nearestRefPos) return null
    //   console.log('chg')
    //   return {
    //     ...curr,
    //     activePagePos: nearestRefPos !== -1 ? nearestRefPos : null
    //   }
    // })
  }

  requestChildrenLoop () {
    if (this.nextChildrenLoopTimeout === null) {
      this.nextChildrenLoopTimeout = window.setTimeout(
        this.childrenLoop,
        this.props.delay ?? 100
      )
    }
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props, state } = this
    console.log('RENDER', state)
    this.childrenRefs = []
    const children = toChildArray(props.children).map((child, childPos) => {
      const wrappedChild = (typeof child === 'string' || typeof child === 'number')
        ? <span>{child}</span>
        : child
      const ref = (node: any) => { this.childrenRefs[childPos] = node }
      return cloneElement(wrappedChild, { ref })
    })

    /* Display */
    return <>{children}</>
  }
}

export type { Props }
export default Paginator
