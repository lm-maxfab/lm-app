import { Component } from 'preact'
import p5 from 'p5'
import sketch from './sketch'

export default class P5Thing extends Component<{}, {}> {
  $root: HTMLDivElement|null = null
  $inner: HTMLDivElement|null = null
  sketch: p5|null = null

  componentDidMount() {
    if (this.$root === null) return
    if (this.$inner === null) return
    this.sketch = new p5(sketch(this.$root), this.$inner)
  }

  render () {
    return <div style={{ position: 'relative', height: '1000px' }} ref={n => { this.$root = n }}>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh'
      }} ref={n => { this.$inner = n }} />
    </div>
  }
}
