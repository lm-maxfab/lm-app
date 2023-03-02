import { Component, JSX } from 'preact'

import ResizeObserver from '../../components/ResizeObserver'

import clamp from '../../utils/clamp'
import interpolate from '../../utils/interpolate'

interface Props {
  progression?: number | null
  images?: string[]
}

interface imageInfos {
  index: number
  url?: string
}

class StopMotionV2 extends Component<Props, {}> {
  imageRatio: number = 1
  imageElements: HTMLImageElement[] = []
  $canvasWrapper: HTMLDivElement | null = null

  constructor(props: Props) {
    super(props)

    this.initCanvasAndPreloadImages = this.initCanvasAndPreloadImages.bind(this)

    this.createCanvas = this.createCanvas.bind(this)
    this.setCanvasSize = this.setCanvasSize.bind(this)
    this.preloadImages = this.preloadImages.bind(this)

    this.drawImageOnCanvas = this.drawImageOnCanvas.bind(this)
    this.drawCurrentFrameOnCanvas = this.drawCurrentFrameOnCanvas.bind(this)

    this.getIndexBasedOnProgression = this.getIndexBasedOnProgression.bind(this)
    this.getFrameBasedOnProgression = this.getFrameBasedOnProgression.bind(this)
  }

  componentDidMount(): void {
    this.initCanvasAndPreloadImages()
  }

  componentDidUpdate(): void {
    if (this.$canvasWrapper === null) return this.initCanvasAndPreloadImages()

    this.drawCurrentFrameOnCanvas()
  }

  getIndexBasedOnProgression(): number {
    if (this.props.images === null || this.props.images === undefined) return 0

    const clampedProgression = clamp(this.props.progression ?? 0, 0, 1)
    const lastIndex = this.props.images.length - 1

    if (clampedProgression === 0) return 0
    if (clampedProgression === 1) return lastIndex

    const interpolatedProgression = interpolate(clampedProgression, 0, lastIndex)

    return Math.round(interpolatedProgression)
  }

  getFrameBasedOnProgression(): HTMLImageElement {
    const index = this.getIndexBasedOnProgression()
    return this.imageElements[index]
  }

  createCanvas(): void {
    if (this.$canvasWrapper === null) return

    const canvas = document.createElement('canvas')
    this.$canvasWrapper.appendChild(canvas)
  }

  initCanvasAndPreloadImages(): void {
    this.createCanvas()
    this.preloadImages()
      .then(this.setCanvasSize)
      .then(this.drawCurrentFrameOnCanvas)
  }

  async preloadImages() {
    const currentIndex = this.getIndexBasedOnProgression()

    if (this.props.images === null || this.props.images === undefined) return

    const imagesBefore = this.props.images?.slice(0, currentIndex).reverse()
    const imagesAfter = this.props.images?.slice(currentIndex)
    const imagesInOrder: imageInfos[] = []

    let indexAfter = currentIndex
    let indexBefore = currentIndex - 1

    while (imagesBefore.length > 0 || imagesAfter.length > 0) {
      if (imagesAfter.length) {
        imagesInOrder.push(
          {
            index: indexAfter,
            url: imagesAfter.shift()
          })
        indexAfter++
        continue
      }

      if (imagesBefore.length) {
        imagesInOrder.push(
          {
            index: indexBefore,
            url: imagesBefore.shift()
          })
        indexBefore--
        continue
      }

      break
    }

    for (const { index, url } of imagesInOrder) {
      const img = new Image()
      await this.loadImage(img, url)
      this.imageElements[index] = img
      if (index === currentIndex) {
        this.imageRatio = img.height / img.width
      }
    }
  }

  loadImage(img: HTMLImageElement, url?: string) {
    if (url === null || url === undefined || url === '') return

    return new Promise((resolve) => {
      img.src = url
      img.onload = (event) => resolve(event)
    })
  }

  setCanvasSize(): void {
    if (this.$canvasWrapper === null) return

    const canvas = this.$canvasWrapper.querySelector('canvas')

    if (canvas === null || canvas === undefined) return

    const wrapperWidth = this.$canvasWrapper.getBoundingClientRect().width

    const calculatedHeight = wrapperWidth * this.imageRatio
    const dimensionsNeedUpdate = (wrapperWidth != canvas.width) || (calculatedHeight != canvas.height)

    if (wrapperWidth && dimensionsNeedUpdate) {
      canvas.width = wrapperWidth
      canvas.height = calculatedHeight
    }
  }

  drawCurrentFrameOnCanvas(): void {
    const currentFrame = this.getFrameBasedOnProgression()
    if (currentFrame === null || currentFrame === undefined) return
    requestAnimationFrame(() => this.drawImageOnCanvas(currentFrame))
  }

  drawImageOnCanvas(image: HTMLImageElement): void {
    if (this.$canvasWrapper === null) return

    const canvas = this.$canvasWrapper.querySelector('canvas')

    if (canvas === null || canvas === undefined) return

    canvas.getContext('2d')?.drawImage(
      // ce qu'on dessine
      image,
      0,
      0,
      image.width,
      image.height,
      // où on le dessine
      0,
      0,
      canvas.width,
      canvas.height
    )
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render(): (JSX.Element | null) {
    return <ResizeObserver onResize={this.setCanvasSize}>
      <div ref={n => { this.$canvasWrapper = n }}></div>
    </ResizeObserver>
  }
}

export type { Props }
export default StopMotionV2
