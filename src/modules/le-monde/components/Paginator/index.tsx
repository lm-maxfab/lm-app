import { Component, JSX, toChildArray, cloneElement } from 'preact'
import Page, { PositionInScreen } from './Page'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  delay?: number
  intervalCheck?: boolean
  triggerBound?: 'top'|'bottom'
  onPageChange?: (value: State['value']) => void
}

interface State {
  value: string|number|null
}

class Paginator extends Component<Props, State> {
  lastChildrenLoopTime: number|null = null
  nextChildrenLoopTimeout: number|null = null
  childrenLoopInterval: number|null = null
  childrenRefs: Page[] = []
  state: State = { value: null }

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR & LIFE CYCLE
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
    this.childrenLoop = this.childrenLoop.bind(this)
    this.requestChildrenLoop = this.requestChildrenLoop.bind(this)
    this.activateChildrenLoopInterval = this.activateChildrenLoopInterval.bind(this)
    this.inactivateChildrenLoopInterval = this.inactivateChildrenLoopInterval.bind(this)
    this.wrapChildrenInPage = this.wrapChildrenInPage.bind(this)
  }

  componentDidMount (): void {
    this.requestChildrenLoop()
    window.addEventListener('scroll', this.requestChildrenLoop)
    window.addEventListener('resize', this.requestChildrenLoop)
    this.activateChildrenLoopInterval()
  }

  componentDidUpdate (prevProps: Props): void {
    this.requestChildrenLoop()
    if (prevProps.intervalCheck !== this.props.intervalCheck) {
      this.activateChildrenLoopInterval()
    }
  }

  componentWillUnmount (): void {
    window.removeEventListener('scroll', this.requestChildrenLoop)
    window.removeEventListener('resize', this.requestChildrenLoop)
    this.inactivateChildrenLoopInterval()
    if (this.nextChildrenLoopTimeout !== null) {
      window.clearTimeout(this.nextChildrenLoopTimeout)
      this.nextChildrenLoopTimeout = null
    }
  }

  /* * * * * * * * * * * * * * *
   * METHODS
   * * * * * * * * * * * * * * */
  childrenLoop (): void {
    this.nextChildrenLoopTimeout = null
    this.lastChildrenLoopTime = Date.now()
    const pagesWithPosition = this.childrenRefs.map((page: Page) => {
      return {
        page,
        position: page.getPositionInScreen()
      }
    })
    const pagesOverTheTriggerWithPosition = pagesWithPosition.filter(elt => {
      const { position } = elt
      if (position === null) return false
      const triggerBound = this.props.triggerBound ?? 'bottom'
      if (triggerBound === 'top') {
        if (position.top.fromTop >= 0) return false
        if (position.bottom.fromTop < 0) return false
        return true
      } else {
        if (position.top.fromBottom >= 0) return false
        if (position.bottom.fromBottom < 0) return false
        return true
      }
    })
    const topsFromBottom = pagesOverTheTriggerWithPosition.map(pageWithPos => (pageWithPos.position as PositionInScreen).top.fromBottom)
    const bottomsFromTop = pagesOverTheTriggerWithPosition.map(pageWithPos => (pageWithPos.position as PositionInScreen).bottom.fromTop)
    const maxTopFromBottom = Math.max(...topsFromBottom)
    const minBottomFromTop = Math.min(...bottomsFromTop)
    const closestsFromBottomWithPosition = pagesOverTheTriggerWithPosition.filter(pwp => pwp.position?.top.fromBottom === maxTopFromBottom)
    const closestFromBottomWithPosition = closestsFromBottomWithPosition.slice(-1)[0]
    const closestFromBottom = closestFromBottomWithPosition?.page ?? null
    const closestFromBottomValue = closestFromBottom?.value ?? null
    const closestsFromTopWithPosition = pagesOverTheTriggerWithPosition.filter(pwp => pwp.position?.bottom.fromTop === minBottomFromTop)
    const closestFromTopWithPosition = closestsFromTopWithPosition.slice(-1)[0]
    const closestFromTop = closestFromTopWithPosition?.page ?? null
    const closestFromTopValue = closestFromTop?.value ?? null
    const triggerBound = this.props.triggerBound ?? 'bottom'
    const newVal = triggerBound === 'top' ? closestFromTopValue : closestFromBottomValue
    const onPageChange = this.props.onPageChange
    const stateSetter = (curr: State) => (newVal !== curr.value) ? { ...curr, value: newVal } : null
    const stateSetterCallback = onPageChange !== undefined ? () => onPageChange(newVal) : undefined
    this.setState(stateSetter, stateSetterCallback)
  }

  requestChildrenLoop (): void {
    if (this.nextChildrenLoopTimeout === null) {
      this.nextChildrenLoopTimeout = window.setTimeout(
        this.childrenLoop,
        this.props.delay ?? 100
      )
    }
  }

  activateChildrenLoopInterval (): void {
    this.inactivateChildrenLoopInterval()
    const intervalCheck = this.props.intervalCheck
    if (intervalCheck === undefined || intervalCheck === false) return
    this.childrenLoopInterval = window.setInterval(this.requestChildrenLoop, this.props.delay)
  }

  inactivateChildrenLoopInterval (): void {
    if (this.childrenLoopInterval !== null) {
      window.clearInterval(this.childrenLoopInterval)
      this.childrenLoopInterval = null
    }
  }

  wrapChildrenInPage (): JSX.Element[] {
    const { children } = this.props
    this.childrenRefs = []
    const clonedChildren = toChildArray(children).map((child, childPos) => {
      const ref = (node: any) => { this.childrenRefs[childPos] = node }
      if (typeof child === 'object' && child.type === Page) {
        const ret = cloneElement(child, { ref }) as JSX.Element
        return ret
      } else {
        const ret = <Page ref={ref} value={childPos}>{child}</Page>
        return ret
      }
    })
    return clonedChildren
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    return <>{this.wrapChildrenInPage()}</>
  }
}

export { Page }
export type { Props }
export default Paginator
