import { Component } from 'preact'

type Props = {
  onResize?: (entries: ResizeObserverEntry[]) => void
}

export default class ResizeObserverComponent extends Component<Props> {
  $root: HTMLDivElement|null = null
  observer: ResizeObserver|null = null

  componentDidMount () {
    if (this.$root === null) return
    this.createObserver()
  }

  componentDidUpdate(previousProps: Readonly<Props>): void {
    const pOnResize = previousProps.onResize
    const { onResize } = this.props
    if (pOnResize !== onResize) this.createObserver()
  }

  componentWillUnmount(): void {
    this.observer?.disconnect()
  }

  createObserver () {
    this.observer?.disconnect()
    if (this.$root === null) return
    this.observer = new ResizeObserver(entries => {
      const { onResize } = this.props
      if (onResize === undefined) return
      onResize(entries)
    })
    this.observer.observe(this.$root)
  }

  render () {
    return <div ref={n => { this.$root = n }}>
      {this.props.children}
    </div>
  }
}
