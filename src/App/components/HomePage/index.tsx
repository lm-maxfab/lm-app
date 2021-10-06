import { Component, JSX } from 'preact'
import clss from 'classnames'
import { Sequencer } from '../../../modules/le-monde/components/Sequencer'
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
  rightSequencer: Sequencer|null = null
  mobileSequencer: Sequencer|null = null
  logoSequencer: Sequencer|null = null

  componentDidUpdate (prevProps: Props) {
    if (prevProps.activate === this.props.activate
      || this.leftSequencer === null
      || this.rightSequencer === null
      || this.mobileSequencer === null
      || this.logoSequencer === null) return
    if (this.props.activate === true) {
      this.leftSequencer.goTo('beginning')
      this.rightSequencer.goTo('beginning')
      this.mobileSequencer.goTo('beginning')
      this.logoSequencer.goTo('beginning')
      this.leftSequencer.play()
      this.rightSequencer.play()
      this.mobileSequencer.play()
      this.logoSequencer.play()
    } else {
      this.leftSequencer.pause()
      this.rightSequencer.pause()
      this.mobileSequencer.pause()
      this.logoSequencer.pause()
      this.leftSequencer.goTo('beginning')
      this.rightSequencer.goTo('beginning')
      this.mobileSequencer.goTo('beginning')
      this.logoSequencer.goTo('beginning')
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
    const desktopImageSequenceLength = Math.max(...props.images.map(img => img.image_animation_slot_desktop)) + 1
    const mobileImageSequenceLength = Math.max(...props.images.map(img => img.image_animation_slot_mobile)) + 1
    const mobileImages = props.images
      .filter(() => true)
      .sort((a, b) => {
        const aSlot = a.image_animation_slot_mobile
        const bSlot = b.image_animation_slot_mobile
        return aSlot - bSlot
      })

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
              tempo={45}
              length={desktopImageSequenceLength}
              loop
              ref={n => this.leftSequencer = n}
              render={(step) => {
                const rendered = leftImages.map((image) => {
                  const slotClass = `${this.mainClass}__image-slot`
                  const isActive = step == image.image_animation_slot_desktop
                  const activeClass = `${slotClass}_${isActive ? 'active' : 'inactive'}`
                  const classes = clss(slotClass, activeClass)
                  const imageStyle: JSX.CSSProperties = {
                    backgroundImage: `url(${image.image_url})`,
                    backgroundPosition: image.image_center
                  }
                  return <div style={imageStyle} className={classes} />
                })
                return rendered
              }} />
          </div>
          <div className={`${this.mainClass}__images-right`}>
            <Sequencer
              tempo={45}
              length={desktopImageSequenceLength}
              loop
              ref={n => this.rightSequencer = n}
              render={(step) => {
                const rendered = rightImages.map((image) => {
                  const slotClass = `${this.mainClass}__image-slot`
                  const isActive = step == image.image_animation_slot_desktop
                  const activeClass = `${slotClass}_${isActive ? 'active' : 'inactive'}`
                  const classes = clss(slotClass, activeClass)
                  const imageStyle: JSX.CSSProperties = {
                    backgroundImage: `url(${image.image_url})`,
                    backgroundPosition: image.image_center
                  }
                  return <div style={imageStyle} className={classes} />
                })
                return rendered
              }} />
          </div>
          <div className={`${this.mainClass}__images-mobile`}>
            <Sequencer
              tempo={45}
              length={mobileImageSequenceLength}
              loop
              ref={n => this.mobileSequencer = n}
              render={(step) => {
                const rendered = mobileImages.map((image) => {
                  const slotClass = `${this.mainClass}__image-slot`
                  const isActive = step == image.image_animation_slot_mobile
                  const activeClass = `${slotClass}_${isActive ? 'active' : 'inactive'}`
                  const classes = clss(slotClass, activeClass)
                  const imageStyle: JSX.CSSProperties = {
                    backgroundImage: `url(${image.image_url})`,
                    backgroundPosition: image.image_center
                  }
                  return <div style={imageStyle} className={classes} />
                })
                return rendered
              }} />
          </div>
        </div>
        <div className={`${this.mainClass}__logo`}>
          <Sequencer
            tempo={8000}
            length={90}
            ref={n => this.logoSequencer = n}
            render={(step) => {
              console.log(step)
              return <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 680 149'>
                <defs><style>{`path { fill-rule: evenodd; }`}</style></defs>
                <path style={{ opacity: step >= 5 ? 1 : 0 }} id="shape-05" d="M49.8655,17.168V0H.3335V3.48a55.5936,55.5936,0,0,0,8.932,3.712V71.108A43.8256,43.8256,0,0,0,.3335,74.82V78.3h29.58V74.82a53.7036,53.7036,0,0,0-9.512-3.712V41.412H37.57A30.2153,30.2153,0,0,0,41.05,49.3h4.06V28.072H41.05a38.3626,38.3626,0,0,0-3.48,7.888H20.4015V5.684h21.112a55.6353,55.6353,0,0,0,3.828,11.484Z"/>
                <path style={{ opacity: step >= 17 ? 1 : 0 }} id="shape-17" d="M99.141,20.764a24.9343,24.9343,0,0,0-8.236-1.392c-7.308,0-11.832,5.684-14.964,14.616h-.348a89.9854,89.9854,0,0,0,.928-13.804,92.2361,92.2361,0,0,0-19.372,1.392v3.596a54.4376,54.4376,0,0,1,8.816,2.204V71.34a36.7633,36.7633,0,0,0-8.816,3.48V78.3H86.033V74.82a57.5659,57.5659,0,0,0-9.164-3.48V48.952c0-9.976,3.944-19.488,11.716-19.488A20.5235,20.5235,0,0,1,97.633,31.9Z"/>
                <path style={{ opacity: step >= 15 ? 1 : 0 }} id="shape-15" d="M151.85,68.208a34.09,34.09,0,0,1-6.264,1.276,21.2865,21.2865,0,0,1-.928-7.192V35.96c0-11.6-7.308-16.472-19.952-16.472a52.2,52.2,0,0,0-19.14,3.48v15.08h4.06a39.69,39.69,0,0,0,4.176-10.556,15.5176,15.5176,0,0,1,8.468-2.436c7.772,0,11.484,5.104,11.484,12.992v6.496c-20.416-.116-32.248,9.628-32.248,19.024,0,9.164,6.38,15.776,15.776,15.776a20.8715,20.8715,0,0,0,17.632-10.788h.116a24.9776,24.9776,0,0,0,3.132,11.02,50.8553,50.8553,0,0,0,15.196-7.656Zm-18.096-9.396c0,7.656-6.496,12.76-11.948,12.76-5.22,0-9.164-4.176-9.164-10.092s4.292-11.832,21.112-11.484Z"/>
                <path style={{ opacity: step >= 8 ? 1 : 0 }} id="shape-08" d="M210.986,26.796V20.532H192.31a41.9411,41.9411,0,0,0-8.12-1.044c-15.196,0-24.244,9.048-24.244,22.388A17.6934,17.6934,0,0,0,169.574,58c-4.292,2.552-7.656,6.612-7.656,10.788,0,4.292,2.32,7.308,7.308,8.816-6.496,3.016-12.528,8.352-12.528,15.08,0,9.628,9.28,14.848,24.824,14.848,16.936,0,31.088-9.628,31.088-21.576,0-8.352-6.148-15.312-19.72-15.776l-11.02-.464c-7.656-.348-10.324-2.088-10.324-4.872,0-2.088,1.276-3.596,3.248-5.22a29.35,29.35,0,0,0,6.496.696c14.732,0,25.056-7.192,25.056-21.924,0-4.756-2.784-10.556-6.38-12.76Zm-15.66,14.036c0,8.236-3.248,13.804-11.368,13.804-7.656,0-13.108-5.452-13.108-15.544,0-8.236,3.364-13.92,11.484-13.92,7.54,0,12.992,5.684,12.992,15.66ZM201.59,88.74c0,7.888-6.844,12.296-16.936,12.296-10.44,0-17.4-4.408-17.4-11.252,0-4.64,3.364-8.7,8.584-11.02,0,0,1.16.116,3.248.232l10.556.464C197.878,79.692,201.59,83.52,201.59,88.74Z"/>
                <path style={{ opacity: step >= 30 ? 1 : 0 }} id="shape-30" d="M312.01,65.3H301.122c.121-4.2243.249-10.2943.249-17.16,0-12.992-2.784-21.344-11.6-21.344-9.744,0-15.196,10.208-15.196,19.256V65.3H263.671V42.108c0-7.424-1.972-15.312-11.368-15.312s-14.964,10.208-14.964,19.256V65.3H226.435V27.376a61.0116,61.0116,0,0,0-8.816-2.204V21.576a93.3773,93.3773,0,0,1,19.604-1.392,81.0439,81.0439,0,0,1-.812,12.064h.232a21.2312,21.2312,0,0,1,19.604-12.76c11.02,0,16.24,6.148,17.4,12.992h.116c2.9-7.424,10.44-12.992,20.184-12.992,12.18,0,18.328,8.352,18.328,25.752C312.275,53.627,312.135,60.6568,312.01,65.3Z"/>
                <path style={{ opacity: step >= 32 ? 1 : 0 }} id="shape-32" d="M341.418,65.3H328.395a38.5006,38.5006,0,0,1-2.631-14.9558c0-18.212,9.396-30.856,26.1-30.856,15.428,0,22.62,9.628,22.62,24.244v4.292H337.248v1.624C337.248,56.4391,338.703,61.6525,341.418,65.3Zm21.466-22.496H337.48c.812-9.976,5.104-17.748,13.224-17.748C358.94,25.056,363,32.712,362.884,42.804Z"/>
                <path style={{ opacity: step >= 25 ? 1 : 0 }} id="shape-25" d="M390.471,65.3h10.904V46.052c0-9.164,5.568-19.256,15.428-19.256,9.164,0,11.716,8.352,11.716,21.344,0,6.8655-.128,12.9355-.249,17.16h10.936c.158-4.6612.333-11.7131.333-20.06,0-17.4-6.032-25.752-18.676-25.752-10.208,0-17.4,5.916-20.184,12.76h-.2319a81.0573,81.0573,0,0,0,.812-12.064,93.3768,93.3768,0,0,0-19.604,1.392v3.596a61.0149,61.0149,0,0,1,8.816,2.204Z"/>
                <path style={{ opacity: step >= 35 ? 1 : 0 }} id="shape-35" d="M469.41,65.3H458.287q-.0645-1.1079-.064-2.3118V26.1h-9.512V20.532h9.512L462.979,4.06h6.148V20.532h16.356V26.1H469.127V59.972A41.2606,41.2606,0,0,0,469.41,65.3Z"/>
                <path style={{ opacity: step >= 10 ? 1 : 0 }} id="shape-10" d="M532.94,61.828a13.7574,13.7574,0,0,1-.441,3.4718H522.024q.012-.28.012-.5718c0-6.6832-5.84-9.2264-12.137-11.9684-7.365-3.2071-15.355-6.6862-15.355-17.38,0-8.932,8.468-15.892,20.88-15.892a54.9127,54.9127,0,0,1,13.34,1.508V36.54h-4.176a38.4358,38.4358,0,0,1-3.48-9.512,18.3731,18.3731,0,0,0-8.12-1.74c-4.988,0-7.772,2.784-7.772,7.192,0,6.8736,6.036,9.53,12.4741,12.3641C525.052,48.0842,532.94,51.5564,532.94,61.828Z"/>
                <path style={{ opacity: step >= 43 ? 1 : 0 }} id="shape-43" d="M283.02,142.544a48.0788,48.0788,0,0,1-8.12-2.088V76.3H263.996v13a95.9939,95.9939,0,0,0-9.976-.58c-17.4,0-30.624,10.672-30.624,32.48,0,16.24,8.236,27.144,21.808,27.144a21.03,21.03,0,0,0,19.604-12.992l.116.116a76.1023,76.1023,0,0,0-.696,12.18,86.9894,86.9894,0,0,0,18.792-1.392Zm-19.024-20.88c0,10.672-6.496,19.024-14.268,19.024-9.628,0-14.964-8.932-14.964-21.924,0-16.008,6.38-24.36,17.168-24.36a21.18,21.18,0,0,1,12.064,3.248Z"/>
                <path style={{ opacity: step >= 40 ? 1 : 0 }} id="shape-40" d="M334.085,112.732c0-14.616-7.192-24.244-22.62-24.244-16.704,0-26.1,12.644-26.1,30.856,0,18.908,9.396,28.884,25.868,28.884a37.6262,37.6262,0,0,0,22.852-8.004l-1.972-4.524a32.136,32.136,0,0,1-16.704,4.988c-11.716,0-18.56-7.308-18.56-22.04v-1.624h37.236Zm-11.6-.928H297.081c.812-9.976,5.104-17.748,13.224-17.748C318.541,94.056,322.601,101.712,322.485,111.804Z"/>
                <path style={{ opacity: step >= 57 ? 1 : 0 }} id="shape-57" d="M360.013,76.3v63.808a43.8256,43.8256,0,0,0-8.932,3.712v3.48h29.58v-3.48a53.7036,53.7036,0,0,0-9.512-3.712V110.412h17.168a30.2153,30.2153,0,0,0,3.48,7.888h4.06V97.072h-4.06a38.3626,38.3626,0,0,0-3.48,7.888H371.149V76.3Z"/>
                <path style={{ opacity: step >= 57 ? 1 : 0 }} id="shape-57-2" data-name="shape-57" d="M392.609,76.3a61.172,61.172,0,0,0,3.48,9.8682h4.524V76.3Z"/>
                <path style={{ opacity: step >= 60 ? 1 : 0 }} id="shape-60" d="M449.889,89.764a24.9343,24.9343,0,0,0-8.236-1.392c-7.308,0-11.832,5.684-14.964,14.616h-.348a89.9728,89.9728,0,0,0,.928-13.804,92.2361,92.2361,0,0,0-19.372,1.392v3.596a54.4376,54.4376,0,0,1,8.816,2.204V140.34a36.7633,36.7633,0,0,0-8.816,3.48v3.48h28.884v-3.48a57.5623,57.5623,0,0,0-9.164-3.48V117.952c0-9.976,3.944-19.488,11.716-19.488a20.5235,20.5235,0,0,1,9.048,2.436Z"/>
                <path style={{ opacity: step >= 50 ? 1 : 0 }} id="shape-50" d="M502.598,137.208a34.0915,34.0915,0,0,1-6.264,1.276,21.2865,21.2865,0,0,1-.928-7.192V104.96c0-11.6-7.308-16.472-19.952-16.472a52.2,52.2,0,0,0-19.14,3.48v15.08h4.06a39.69,39.69,0,0,0,4.176-10.556,15.5178,15.5178,0,0,1,8.4679-2.436c7.772,0,11.4841,5.104,11.4841,12.992v6.496c-20.4161-.116-32.248,9.628-32.248,19.024,0,9.164,6.38,15.776,15.776,15.776a20.8717,20.8717,0,0,0,17.632-10.788h.116a24.9788,24.9788,0,0,0,3.1319,11.02,50.8512,50.8512,0,0,0,15.1961-7.656Zm-18.096-9.396c0,7.656-6.496,12.76-11.948,12.76-5.22,0-9.164-4.176-9.164-10.092s4.292-11.832,21.112-11.484Z"/>
                <path style={{ opacity: step >= 64 ? 1 : 0 }} id="shape-64" d="M573.914,147.3v-3.48a37.4524,37.4524,0,0,0-7.888-3.48s.58-10.904.58-26.1c0-17.4-6.032-25.752-18.676-25.752-10.208,0-17.4,5.916-20.184,12.76h-.232a81.043,81.043,0,0,0,.812-12.064,93.3773,93.3773,0,0,0-19.604,1.392v3.596a61.0181,61.0181,0,0,1,8.816,2.204V140.34a42.1047,42.1047,0,0,0-8.816,3.48v3.48h27.4919v-3.364a47.2852,47.2852,0,0,0-7.7719-3.48V115.052c0-9.164,5.5679-19.256,15.4279-19.256,9.164,0,11.716,8.352,11.716,21.344,0,13.108-.464,23.316-.464,23.316a47.2852,47.2852,0,0,0-7.7719,3.48V147.3Z"/>
                <path style={{ opacity: step >= 54 ? 1 : 0 }} id="shape-54" d="M623.551,137.092a28.1819,28.1819,0,0,1-13.1079,3.48c-11.136,0-18.9081-7.192-18.9081-22.62,0-13.34,4.872-23.548,14.036-23.548a19.4619,19.4619,0,0,1,9.7441,2.204,40.58,40.58,0,0,0,3.828,10.672h4.176V90.46a58.2662,58.2662,0,0,0-15.08-1.856c-18.56,0-28.188,11.716-28.188,31.32,0,20.532,11.948,28.188,25.636,28.188a33.2007,33.2007,0,0,0,19.72-6.612Z"/>
                <path style={{ opacity: step >= 70 ? 1 : 0 }} id="shape-70" d="M679.693,112.732c0-14.616-7.192-24.244-22.62-24.244-16.704,0-26.1,12.644-26.1,30.856,0,18.908,9.396,28.884,25.868,28.884a37.6264,37.6264,0,0,0,22.852-8.004l-1.972-4.524a32.136,32.136,0,0,1-16.704,4.988c-11.716,0-18.56-7.308-18.56-22.04v-1.624h37.2361Zm-11.6-.928H642.689c.812-9.976,5.104-17.748,13.224-17.748C664.149,94.056,668.209,101.712,668.093,111.804Z"/>
              </svg>
            }} />
        </div>
      </div>
    )
  }
}

export type { Props }
export default Home
