import { Component, JSX } from 'preact'

import clamp from '../../utils/clamp'
import interpolate from '../../utils/interpolate'

interface State {
  width: number | null | undefined
  height: number | null | undefined
  pWidth: number | null | undefined
  pHeight: number | null | undefined
}

interface Props {
  images: string[]
  progression: number | null | undefined
  width: number | null | undefined
  height: number | null | undefined
}

class StopMotionV2 extends Component<Props, State> {
  context: CanvasRenderingContext2D | null = null
  canvas: HTMLCanvasElement | null = null
  imagesElements: HTMLImageElement[] = []

  constructor(props: Props) {
    super(props)

    this.initialize = this.initialize.bind(this)
    this.setCanvasDimensions = this.setCanvasDimensions.bind(this)
    this.preloadImages = this.preloadImages.bind(this)
    this.drawImageOnCanvas = this.drawImageOnCanvas.bind(this)
    this.getFrameBasedOnProgression = this.getFrameBasedOnProgression.bind(this)
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    return {
      ...state,
      pWidth: state.width,
      pHeight: state.height,
      width: props.width,
      height: props.height,
    }
  }

  componentDidMount(): void {
    this.initialize()
  }

  componentDidUpdate(): void {
    if (!this.canvas) {
      this.initialize()
      return
    }

    const { images, progression } = this.props

    if (images?.length === 0) return
    if (progression === null || typeof progression === 'undefined') return

    // re-set dimensions si jamais elles ont changé
    if (this.props.width && (this.props.width != this.state.pWidth)) this.setCanvasDimensions()
    if (this.props.height && (this.props.height != this.state.pHeight)) this.setCanvasDimensions()

    // update image
    const currentFrame = this.getFrameBasedOnProgression() ?? 0
    requestAnimationFrame(() => this.drawImageOnCanvas(currentFrame))
  }

  getFrameBasedOnProgression(): HTMLImageElement {
    const clampedProgression = clamp(this.props.progression ?? 0, 0, 1)
    const interpolatedProgression = Math.round(interpolate(clampedProgression, 0, (this.props.images?.length ?? 0) - 1))
    return this.imagesElements?.[interpolatedProgression]
  }

  preloadImages(): void {
    for (const url of this.props.images) {
      const img = new Image()
      img.src = url
      this.imagesElements.push(img)
    }

    const firstFrame = this.props.progression ? this.getFrameBasedOnProgression() : this.imagesElements[0]

    firstFrame.onload = () => {
      this.setCanvasDimensions()
      this.drawImageOnCanvas(firstFrame)
    }
  }

  setCanvasDimensions(): void {
    if (!this.canvas) return

    const imgWidth = this.imagesElements[0].width
    const imgHeight = this.imagesElements[0].height

    const maxWidth = this.props.width
    const maxHeight = this.props.height

    this.canvas.width = maxWidth ? Math.min(imgWidth, maxWidth) : imgWidth
    this.canvas.height = maxHeight ? Math.min(imgHeight, maxHeight) : imgHeight
  }

  drawImageOnCanvas(image: HTMLImageElement): void {
    if (!image) return
    if (!this.canvas) return

    const imgWidth = Math.min(this.canvas.width, image.width)
    const imgHeight = (imgWidth * image.height) / image.width

    const posX = this.canvas.width / 2 - imgWidth / 2
    const posY = this.canvas.height / 2 - imgHeight / 2

    this.canvas?.getContext('2d')?.drawImage(
      // ce qu'on dessine
      image,
      0,
      0,
      image.width,
      image.height,
      // où on le dessine
      posX,
      posY,
      imgWidth,
      imgHeight
    )
  }

  initialize(): void {
    if (!this.$canvasWrapper) return
    if (!this.props.width || !this.props.height) return

    this.canvas = document.createElement('canvas')
    this.context = this.canvas?.getContext('2d')

    this.$canvasWrapper?.appendChild(this.canvas)

    this.preloadImages()
  }

  $canvasWrapper: HTMLDivElement | null = null

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render(): (JSX.Element | null) {
    return <div ref={n => { this.$canvasWrapper = n }}></div>
  }
}

export type { Props }
export default StopMotionV2
