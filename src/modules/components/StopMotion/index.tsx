import { Component, JSX } from 'preact'

import clamp from '../../utils/clamp'
import interpolate from '../../utils/interpolate'

import styles from './styles.module.scss'

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

    if (images.length === 0) return <></>
    if (!progression) return <></>

    const clampedProgression = clamp(progression, 0, 1)
    const interpolatedProgression = Math.round(interpolate(clampedProgression, 0, images.length - 1))

    return (
      <div
        {...props}
        className={styles['wrapper']}
      >
        {images.map((_el, i) => {
          const classList = [
            styles['frame'],
            i === interpolatedProgression ? styles['frame--active'] : ''
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
