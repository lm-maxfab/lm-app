import { Component, JSX, ComponentChild } from 'preact'
import IOComponent from '../IntersectionObserver'

type IOE = IntersectionObserverEntry

interface Props {
  onEnterFromTop?: (pos: number) => any
  onLeaveFromTop?: (pos: number) => any
  onEnterFromBottom?: (pos: number) => any
  onLeaveFromBottom?: (pos: number) => any
}

class Paginator extends Component<Props, {}> {
  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
    this.ioEventCallback = this.ioEventCallback.bind(this)
  }

  /* * * * * * * * * * * * * * *
   * METHODS
   * * * * * * * * * * * * * * */
  ioEventCallback = (entry: IOE, position: number) => {
    const { props: { onEnterFromTop, onLeaveFromTop, onEnterFromBottom, onLeaveFromBottom } } = this
    const rootHeight = entry.rootBounds?.height ?? 0
    const entryTop = entry.boundingClientRect.top
    const eventIsFromBound = entryTop >= rootHeight / 2 ? 'bottom' : 'top'
    if (entry.isIntersecting && eventIsFromBound === 'top' && onEnterFromTop !== undefined) onEnterFromTop(position)
    else if (entry.isIntersecting && eventIsFromBound === 'bottom' && onEnterFromBottom !== undefined) onEnterFromBottom(position)
    else if (!entry.isIntersecting && eventIsFromBound === 'top' && onLeaveFromTop !== undefined) onLeaveFromTop(position)
    else if (!entry.isIntersecting && eventIsFromBound === 'bottom' && onLeaveFromBottom !== undefined) onLeaveFromBottom(position)
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this
    
    // Logic
    const children = Array.isArray(props.children) ? props.children : [props.children]
    const renderedChildren: ComponentChild[] = [
      <IOComponent
        callback={e => this.ioEventCallback(e, 0)}
        render={() => <div />} />
    ]
    children.forEach((child, childPos) => {
      renderedChildren.push(child)
      renderedChildren.push(
        <IOComponent
          callback={e => this.ioEventCallback(e, childPos + 1)}
          render={() => <div />} />
      )
    })

    // Display
    return <>{renderedChildren}</>
  }
}

export type { Props }
export default Paginator
