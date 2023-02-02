import { Component, JSX } from 'preact'

import clamp from '../../utils/clamp'
import interpolate from '../../utils/interpolate'

interface Props {
  images: string[]
  progression: number | null | undefined
  width: number | null | undefined
  height: number | null | undefined
}

class StopMotionV2 extends Component<Props, {}> {
  context: CanvasRenderingContext2D | null = null
  canvas: HTMLCanvasElement | null = null
  imagesElements: HTMLImageElement[] = []

  constructor(props: Props) {
    super(props)

    this.initialize = this.initialize.bind(this)
    this.preloadImages = this.preloadImages.bind(this)
    this.drawImageOnCanvas = this.drawImageOnCanvas.bind(this)
    this.getFrameBasedOnProgression = this.getFrameBasedOnProgression.bind(this)
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

    // re-set height/width si jamais elle a changé
    if (this.props.height && (this.props.height != this.canvas.height)) this.canvas.height = this.props.height
    if (this.props.width && (this.props.width != this.canvas.width)) this.canvas.width = this.props.width

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
      this.drawImageOnCanvas(firstFrame);
    }
  }

  drawImageOnCanvas(image: HTMLImageElement): void {
    if (!image) return
    if (!this.canvas) return

    const imgWidth = Math.min(this.canvas.width, image.width)
    const imgHeight = (imgWidth * image.height) / image.width

    const posX = this.canvas.width / 2 - imgWidth / 2;
    const posY = this.canvas.height / 2 - imgHeight / 2;

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
      imgHeight);
  }

  initialize(): void {
    if (!this.$canvasWrapper) return
    if (!this.props.width || !this.props.height) return

    this.canvas = document.createElement('canvas')
    this.context = this.canvas?.getContext('2d')

    this.canvas.width = this.props.width
    this.canvas.height = this.props.height

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
