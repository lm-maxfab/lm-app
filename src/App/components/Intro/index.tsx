import { Component, JSX, VNode } from 'preact'
import clss from 'classnames'
import IOComponent from '../../../modules/le-monde/components/IntersectionObserver'
import { IntroImage as IntroImageInterface } from '../../types'
import './styles.css'

type IOE = IntersectionObserverEntry

interface IntroImageProps {
  image: IntroImageInterface
  parentMainClass: string
}

/* * * * * * * * * * * * * * *
 * INTRO IMAGE
 * * * * * * * * * * * * * * */
const IntroImage = (props: IntroImageProps) => {
  const { image, parentMainClass } = props
  return (
    <div className={`${parentMainClass}__image-slot`}>
      <div className={`${parentMainClass}__image-slot-inner`}>
        <div
          className={`${parentMainClass}__image-wrapper`}
          style={{ maxHeight: image.height }}>
          <IOComponent
            threshold={[.2, .3, .4]}
            render={(ioEntry: IOE|null) => (
              <img
                loading='lazy'
                src={image.url}
                className={`${parentMainClass}__image-image`}
                style={{
                  opacity: (ioEntry?.intersectionRatio ?? 0) > .3 ? '1' : '.3',
                  left: image.h_position,
                  transform: `translateX(calc(-1 * ${image.h_position}))`
                }} />
            )} />
        </div>
      </div>
    </div>
  )
}

interface ImageVisibility {
  pos: number
  ratio: number
}

interface Props {
  className?: string
  style?: JSX.CSSProperties
  images: IntroImageInterface[]
  paragraph_basis: JSX.Element
  show_paragraph: boolean
}

interface State {
  current_image: number|null
  images_visibility: ImageVisibility[]
}

class Intro extends Component<Props, State> {
  mainClass: string = 'frag-intro'
  state: State = {
    current_image: null,
    images_visibility: []
  }

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
    this.handleImageIntersectionEvent = this.handleImageIntersectionEvent.bind(this)
  }

  /* * * * * * * * * * * * * * *
   * METHODS
   * * * * * * * * * * * * * * */
  handleImageIntersectionEvent (pos: number, isIntersecting: boolean, ratio: number) {
    this.setState(curr => {
      const currImgVis = curr.images_visibility
      const posInCurrState = currImgVis.findIndex(imgVis => imgVis.pos === pos)
      if (posInCurrState === -1 && !isIntersecting) return null
      else if (posInCurrState === -1 && isIntersecting) {
        const newImgVis = [...currImgVis, { pos, ratio }]
        return { ...curr, images_visibility: newImgVis }
      } else if (posInCurrState !== -1 && !isIntersecting) {
        const newImgVis = [
          ...currImgVis.slice(0, posInCurrState),
          ...currImgVis.slice(posInCurrState + 1)
        ]
        return { ...curr, images_visibility: newImgVis }
      } else {
        const newImgVis = [
          ...currImgVis.slice(0, posInCurrState),
          { pos, ratio },
          ...currImgVis.slice(posInCurrState + 1)
        ]
        return { ...curr, images_visibility: newImgVis }
      }
    })
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props, state } = this
    
    // Logic
    const maxImageRatio = Math.max(...state.images_visibility.map(imgVis => imgVis.ratio))
    const currentMaxImgVis = state.images_visibility.find(imgVis => imgVis.ratio === maxImageRatio)
    const currentFragment = currentMaxImgVis?.pos ?? null
    const paragraph = props.images
      .slice(0, (currentFragment ?? -1) + 1)
      .map(fragment => <span className={`${this.mainClass}__paragraph-chunk`}>
        {fragment.paragraph_chunk}
      </span>)

    // Classes
    const classes = clss(this.mainClass, props.className)
    const inlineStyle = { ...props.style }

    const paragraphVisibilityClass = `${this.mainClass}__paragraph_visibility-${props.show_paragraph}`
    const paragraphClasses = clss(`${this.mainClass}__paragraph`, paragraphVisibilityClass)

    // Display
    return (
      <div className={classes} style={inlineStyle}>
        {/* Sticky paragraph */}
        <div className={paragraphClasses}>
          <span className={`${this.mainClass}__paragraph-chunk`}>
            {props.paragraph_basis}
          </span>
          {paragraph}
        </div>

        {/* Fragments */}
        <div className={`${this.mainClass}__scrollable-background`}>
          {props.images.map((image: IntroImageInterface, imagePos: number) => (
            <IOComponent
              threshold={[0, .2, .4, .6, .8, 1]}
              callback={(ioEntry: IOE|null) => {
                this.handleImageIntersectionEvent(
                  imagePos,
                  ioEntry?.isIntersecting ?? false,
                  ioEntry?.intersectionRatio ?? 0
                )
              }}>
              <IntroImage
                key={imagePos}
                image={image}
                parentMainClass={this.mainClass} />
            </IOComponent>
          ))}
        </div>
      </div>
    )
  }
}

export type { Props, State }
export default Intro
