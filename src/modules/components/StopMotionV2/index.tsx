import { Component, JSX } from 'preact'

import clamp from '../../utils/clamp'
import interpolate from '../../utils/interpolate'

interface Props {
  fullscreen: boolean
  width: number | null | undefined
  height: number | null | undefined
  progression: number | null | undefined
  images: string[]
}

class StopMotionV2 extends Component<Props, {}> {
  canvas: HTMLCanvasElement | null = null
  imagesElements: HTMLImageElement[] = []

  constructor(props: Props) {
    super(props)

    this.initialize = this.initialize.bind(this)
    this.preloadImages = this.preloadImages.bind(this)
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

    // update height/width si jamais elle a changé
    if (this.props.width && (this.props.width != this.canvas.width)) this.canvas.width = this.props.width
    if (this.props.height && (this.props.height != this.canvas.height)) this.canvas.height = this.props.height

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
    if (!this.props.width || !this.props.height) return

    this.canvas = document.createElement('canvas')

    this.canvas.width = this.props.width
    this.canvas.height = this.props.height

    this.$canvasWrapper?.appendChild(this.canvas)

    this.preloadImages()
  }

  async preloadImages() {
    const currentIndex = this.getIndexBasedOnProgression() ?? 0
    console.log(currentIndex)

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
      if (index === currentIndex) this.drawImageOnCanvas(this.imagesElements[index])
    }
  }

  loadImage(img: HTMLImageElement, url?: string) {
    if (!url) return

    return new Promise((resolve, reject) => {
      img.src = url
      img.onload = (event) => resolve(event)
    })
  }

  drawImageOnCanvas(image: HTMLImageElement): void {
    if (!image) return
    if (!this.canvas) return

    const { fullscreen } = this.props
    const imgRatio = image.height / image.width
    const canvasRatio = this.canvas.height / this.canvas.width

    let frameWidth, frameHeight

    if (imgRatio > canvasRatio) {
      frameWidth = fullscreen ? this.canvas.width : Math.min(this.canvas.width, image.width)
      frameHeight = (frameWidth * image.height) / image.width
    } else {
      frameHeight = fullscreen ? this.canvas.height : Math.min(this.canvas.height, image.height)
      frameWidth = (frameHeight * image.width) / image.height
    }

    const posX = this.canvas.width / 2 - frameWidth / 2
    const posY = this.canvas.height / 2 - frameHeight / 2

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
      frameWidth,
      frameHeight
    )
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
