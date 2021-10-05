import { Component, JSX } from 'preact'
import clss from 'classnames'
import { Sequencer, SequencerSlot } from '../../../modules/le-monde/components/Sequencer'
import './styles.css'
import { HomeImage } from '../../types'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  images: HomeImage[]
  isVisible: boolean
  activate: boolean
}

class Home extends Component<Props, {}> {
  mainClass: string = 'frag-home'

  leftSequencer: Sequencer|null = null

  componentDidUpdate (prevProps: Props) {
    if (prevProps.activate === this.props.activate
      || this.leftSequencer === null) return
    if (this.props.activate === true) {
      this.leftSequencer.goTo('beginning')
      this.leftSequencer.play()
    } else {
      this.leftSequencer.pause()
      this.leftSequencer.goTo('beginning')
    }
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    // Logic
    const leftImages = props.images
      .filter(image => image.image_side === 'left')
      .sort((a, b) => (a.image_animation_slot_desktop - b.image_animation_slot_desktop))
    const rightImages = props.images
      .filter(image => image.image_side === 'right')
      .sort((a, b) => (a.image_animation_slot_desktop - b.image_animation_slot_desktop))
    // const mobileImages = props.images
    //   .sort((a, b) => (a.image_animation_slot_mobile - b.image_animation_slot_mobile))

    // Classes
    const visibilityClass = `${this.mainClass}_visibility-${props.isVisible}`
    const classes = clss(this.mainClass, visibilityClass, props.className)
    const inlineStyle: JSX.CSSProperties = { ...props.style }

    // Display
    return (
      <div className={classes} style={inlineStyle}>
        <div className={`${this.mainClass}__images`}>
          <div className={`${this.mainClass}__images-left`}>
            <Sequencer
              tempo={120}
              length={5}
              ref={n => this.leftSequencer = n}>
              {new Array(10).fill(null).map((e, i) => (
                <SequencerSlot begin={i} end='end'>
                  <div>I am the div {i}</div>
                </SequencerSlot>
              ))}
            </Sequencer>




            {/*leftImages.map(image => {
              const imageStyle: JSX.CSSProperties = {
                backgroundImage: `url(${image.image_url})`,
                backgroundPosition: image.image_center
              }
              return <div
                style={imageStyle}
                className={`${this.mainClass}__image-slot`} />
            })*/}
          </div>
          <div className={`${this.mainClass}__images-right`}>
            {/*rightImages.map(image => {
              const imageStyle: JSX.CSSProperties = {
                backgroundImage: `url(${image.image_url})`,
                backgroundPosition: image.image_center
              }
              return <div
                style={imageStyle}
                className={`${this.mainClass}__image-slot`} />
            })*/}
          </div>
          <div className={`${this.mainClass}__images-mobile`}></div>
        </div>
        <div className={`${this.mainClass}__logo`}>
          WSH
        </div>
      </div>
    )
  }
}

export type { Props }
export default Home
