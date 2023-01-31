import { Component, JSX } from 'preact'

import clamp from '../../utils/clamp'
import interpolate from '../../utils/interpolate'

import './styles.scss'

interface State {
  progression: number | null | undefined
  images: string[]
  pProgression: number | null
  pImages: string[] | null
}

interface Props extends JSX.HTMLAttributes<HTMLDivElement> {
  progression: number | null | undefined
  images: string[]
}

class StopMotion extends Component<Props, {}> {
  static clss = 'lm-stop-motion'
  clss = StopMotion.clss

  state: State = {
    progression: 0,
    images: this.props.images,
    pProgression: null,
    pImages: null
  }

  constructor(props: Props) {
    super(props)
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    return {
      ...state,
      pImages: state.images,
      pProgression: state.progression,
      images: props.images,
      progression: props.progression,
    }
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render(): (JSX.Element | null) {
    const { images, progression, ...props } = this.props

    if (images.length === 0) return null
    if (!progression) return null

    const clampedProgression = clamp(progression, 0, 1)
    const interpolatedProgression = Math.round(interpolate(clampedProgression, 0, images.length - 1))

    const imgClassName = `${this.clss}__frame`

    return (
      <div
        {...props}
        className={this.clss}
      >
        {images.map((_el, i) => {
          const classList = [
            imgClassName,
            i === interpolatedProgression ? ` ${imgClassName}--active` : ''
          ]

          return <img src={images[i]} class={classList.join(' ')}></img>
        }
        )}
      </div>
    )
  }
}

export type { Props }
export default StopMotion
