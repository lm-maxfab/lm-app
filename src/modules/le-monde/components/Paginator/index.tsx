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
  value: any
}

class Paginator extends Component<Props, State> {
  static Page = Page

  nextChildrenLoopTimeout: number|null = null
  requestChildrenLoopInterval: number|null = null
  childrenRefs: Page[] = []
  state: State = { value: undefined }

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR & LIFE CYCLE
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
    this.getDelay = this.getDelay.bind(this)
    this.childrenLoop = this.childrenLoop.bind(this)
    this.requestChildrenLoop = this.requestChildrenLoop.bind(this)
    this.clearNextChildrenLoopTimeout = this.clearNextChildrenLoopTimeout.bind(this)
    this.activateRequestChildrenLoopInterval = this.activateRequestChildrenLoopInterval.bind(this)
    this.inactivateRequestChildrenLoopInterval = this.inactivateRequestChildrenLoopInterval.bind(this)
    this.wrapChildrenInPage = this.wrapChildrenInPage.bind(this)
  }

  componentDidMount (): void {
    this.requestChildrenLoop()
    window.addEventListener('scroll', this.requestChildrenLoop)
    window.addEventListener('resize', this.requestChildrenLoop)
    if (this.props.intervalCheck) this.activateRequestChildrenLoopInterval()
  }

  componentDidUpdate (prevProps: Props): void {
    this.requestChildrenLoop()
    const pIntervalCheck = prevProps.intervalCheck
    const intervalCheck = this.props.intervalCheck
    if (pIntervalCheck !== intervalCheck) {
      if (intervalCheck) this.activateRequestChildrenLoopInterval()
      else this.inactivateRequestChildrenLoopInterval()
    }
  }

  componentWillUnmount (): void {
    window.removeEventListener('scroll', this.requestChildrenLoop)
    window.removeEventListener('resize', this.requestChildrenLoop)
    this.inactivateRequestChildrenLoopInterval()
    this.clearNextChildrenLoopTimeout()
  }

  /* * * * * * * * * * * * * * *
   * METHODS
   * * * * * * * * * * * * * * */
  getDelay (): number {
    return this.props.delay ?? 100
  }

  childrenLoop (): void {
    const pagesWithPosition = this.childrenRefs.map((page: Page) => ({
      page,
      position: page.getPositionInScreen()
    }))
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
    const closestFromBottomValue = closestFromBottom?.value
    const closestsFromTopWithPosition = pagesOverTheTriggerWithPosition.filter(pwp => pwp.position?.bottom.fromTop === minBottomFromTop)
    const closestFromTopWithPosition = closestsFromTopWithPosition.slice(-1)[0]
    const closestFromTop = closestFromTopWithPosition?.page ?? null
    const closestFromTopValue = closestFromTop?.value
    const triggerBound = this.props.triggerBound ?? 'bottom'
    const newVal = triggerBound === 'top' ? closestFromTopValue : closestFromBottomValue
    const stateSetter = (curr: State) => {
      try {
        const stringifiedNew = JSON.stringify(newVal)
        const stringifiedCurr = JSON.stringify(curr.value)
        if (stringifiedNew !== stringifiedCurr) return { ...curr, value: newVal }
        else {
          this.clearNextChildrenLoopTimeout()
          return null
        }
      } catch (err) {
        if (newVal !== curr.value) return { ...curr, value: newVal }
        else {
          this.clearNextChildrenLoopTimeout()
          return null
        }
      }
    }
    const stateSetterCallback = () => {
      const onPageChange = this.props.onPageChange
      if (onPageChange !== undefined) onPageChange(newVal)
      this.clearNextChildrenLoopTimeout()
    }
    this.setState(
      stateSetter,
      stateSetterCallback
    )
  }

  requestChildrenLoop (): void {
    if (this.nextChildrenLoopTimeout === null) {
      this.nextChildrenLoopTimeout = window.setTimeout(
        this.childrenLoop,
        this.getDelay()
      )
    }
  }

  clearNextChildrenLoopTimeout (): void {
    if (this.nextChildrenLoopTimeout !== null) {
      window.clearTimeout(this.nextChildrenLoopTimeout)
      this.nextChildrenLoopTimeout = null
    }
  }

  activateRequestChildrenLoopInterval (): void {
    this.inactivateRequestChildrenLoopInterval()
    this.requestChildrenLoopInterval = window.setInterval(
      this.requestChildrenLoop,
      this.getDelay()
    )
  }

  inactivateRequestChildrenLoopInterval (): void {
    if (this.requestChildrenLoopInterval !== null) {
      window.clearInterval(this.requestChildrenLoopInterval)
      this.requestChildrenLoopInterval = null
    }
  }

  wrapChildrenInPage (): JSX.Element[] {
    const { children } = this.props
    this.childrenRefs = []
    const clonedChildren = toChildArray(children).map((child, childPos) => {
      const ref = (node: any) => { this.childrenRefs[childPos] = node }
      return (typeof child === 'object' && child.type === Page)
        ? cloneElement(child, { ref }) as JSX.Element
        : <Page ref={ref} value={childPos}>{child}</Page>
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
