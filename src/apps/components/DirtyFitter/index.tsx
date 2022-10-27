import { Component } from 'preact'
import bem from '../../../modules/utils/bem'
import './styles.scss'

type Props = {}

type State = {
  containerWidth: number
  containerHeight: number
  ghostWidth: number
  ghostHeight: number
}

export const className = bem('metoo-block-fitter')

export default class DirtyFitter extends Component<Props, State> {
  $container: HTMLDivElement|null = null
  $ghost: HTMLSpanElement|null = null
  state: State = {
    containerWidth: 0,
    containerHeight: 0,
    ghostWidth: 0,
    ghostHeight: 0
  }

  constructor (props: Props) {
    super(props)
    this.getContainerDimensions = this.getContainerDimensions.bind(this)
    this.getGhostDimensions = this.getGhostDimensions.bind(this)
    this.saveDimensions = this.saveDimensions.bind(this)
    window.addEventListener('resize', this.saveDimensions)
  }

  componentDidMount(): void {
    this.saveDimensions()
  }

  componentWillUnmount(): void {
    window.removeEventListener('resize', this.saveDimensions)
  }

  getContainerDimensions () {
    if (this.$container === null) return
    const { width, height } = this.$container.getBoundingClientRect()
    return { width, height }
  }

  getGhostDimensions () {
    if (this.$ghost === null) return
    const { width, height } = this.$ghost.getBoundingClientRect()
    return { width, height }
  }

  saveDimensions () {
    const containerDimensions = this.getContainerDimensions()
    if (containerDimensions === undefined) return

    const ghostDimensions = this.getGhostDimensions()
    if (ghostDimensions === undefined) return

    this.setState(curr => ({
      ...curr,
      containerWidth: containerDimensions.width,
      containerHeight: containerDimensions.height,
      ghostWidth: ghostDimensions.width,
      ghostHeight: ghostDimensions.height
    }))
  }

  render () {
    const {
      containerWidth,
      containerHeight,
      ghostWidth,
      ghostHeight
    } = this.state 

    const rawContainerRatio = containerWidth / containerHeight
    const rawGhostRatio = ghostWidth / ghostHeight
    const containerRatio = Number.isNaN(rawContainerRatio) ? 0 : rawContainerRatio
    const ghostRatio = Number.isNaN(rawGhostRatio) ? 0 : rawGhostRatio
    const containerIsWider = containerRatio > ghostRatio
    const childScale = containerIsWider
      ? containerHeight / ghostHeight
      : containerWidth / ghostWidth

    return <div
      ref={n => { this.$container = n }}
      className={className.value}>
      <span
        ref={n => { this.$ghost = n }}
        className={className.elt('ghost').value}>
        {this.props.children}
      </span>
      <div
        style={{
          // transformOrigin: 'top left',
          transform: `scale(${childScale})`
        }}
        className={className.elt('child').value}>
        {this.props.children}
      </div>
    </div>
  }
}
