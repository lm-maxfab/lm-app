import { Component, JSX } from 'preact'
import clamp from '../../utils/clamp'
import interpolate from '../../utils/interpolate'

// [WIP] review this

interface Props {
  progression: number | null | undefined
  images: string[]
}

class StopMotionV2 extends Component<Props, {}> {
  canvas: HTMLCanvasElement | null = null
  imageRatio: number = 1
  imagesElements: HTMLImageElement[] = []
  $canvasWrapper: HTMLDivElement | null = null

  constructor(props: Props) {
    super(props)

    this.initialize = this.initialize.bind(this)
    this.preloadImages = this.preloadImages.bind(this)
    this.setCanvasSize = this.setCanvasSize.bind(this)
    this.drawImageOnCanvas = this.drawImageOnCanvas.bind(this)
    this.getIndexBasedOnProgression = this.getIndexBasedOnProgression.bind(this)
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

    this.setCanvasSize()

    // update image
    const currentFrame = this.getFrameBasedOnProgression()
    if (!currentFrame) return
    requestAnimationFrame(() => this.drawImageOnCanvas(currentFrame))
  }

  getIndexBasedOnProgression(): number | undefined {
    const clampedProgression = clamp(this.props.progression ?? 0, 0, 1)
    const interpolatedProgression = Math.floor(interpolate(clampedProgression, 0, (this.props.images?.length ?? 0) - 1))
    return interpolatedProgression
  }

  getFrameBasedOnProgression(): HTMLImageElement | undefined | void {
    const index = this.getIndexBasedOnProgression()
    if (!index) return
    return this.imagesElements?.[index]
  }

  initialize(): void {
    if (!this.$canvasWrapper) return

    this.canvas = document.createElement('canvas')
    this.$canvasWrapper?.appendChild(this.canvas)

    this.setCanvasSize()
    this.preloadImages()
  }

  async preloadImages() {
    const currentIndex = this.getIndexBasedOnProgression() ?? 0

    const imagesBefore = this.props.images.slice(0, currentIndex).reverse()
    const imagesAfter = this.props.images.slice(currentIndex, -1)
    const imagesInOrder = []

    let indexAfter = currentIndex
    let indexBefore = currentIndex - 1

    while (imagesBefore.length || imagesAfter.length) {
      if (imagesAfter.length) {
        imagesInOrder.push(
          {
            index: indexAfter,
            url: imagesAfter.shift()
          });
        indexAfter++
      }

      if (imagesBefore.length) {
        imagesInOrder.push(
          {
            index: indexBefore,
            url: imagesBefore.shift()
          });
        indexBefore--
      }
    }

    for (const { index, url } of imagesInOrder) {
      const img = new Image()
      await this.loadImage(img, url)
      this.imagesElements[index] = img
      if (index === currentIndex) {
        this.imageRatio = img.height / img.width
        this.setCanvasSize()
        this.drawImageOnCanvas(this.imagesElements[index])
      }
    }
  }

  loadImage(img: HTMLImageElement, url?: string) {
    if (!url) return

    return new Promise((resolve, reject) => {
      img.src = url
      img.onload = (event) => resolve(event)
    })
  }

  setCanvasSize(): void {
    if (!this.canvas) return

    const wrapperWidth = this.$canvasWrapper?.getBoundingClientRect().width
    if (wrapperWidth && wrapperWidth != this.canvas.width) {
      this.canvas.width = wrapperWidth
      this.canvas.height = wrapperWidth * this.imageRatio
    }
  }

  drawImageOnCanvas(image: HTMLImageElement): void {
    if (!image) return
    if (!this.canvas) return

    this.canvas?.getContext('2d')?.drawImage(
      // ce qu'on dessine
      image,
      0,
      0,
      image.width,
      image.height,
      // où on le dessine
      0,
      0,
      this.canvas.width,
      this.canvas.height
    )
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render(): (JSX.Element | null) {
    return <div ref={n => { this.$canvasWrapper = n }}></div>
  }
}

export type { Props }
export default StopMotionV2
