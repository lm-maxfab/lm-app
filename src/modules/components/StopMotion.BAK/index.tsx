import { Component, JSX } from 'preact'
import clamp from '../../utils/clamp'
import interpolate from '../../utils/interpolate'
import styles from './styles.module.scss'

interface State {
  progression: number
  images: string[]
  pProgression: number
  pImages: string[]
}

interface Props {
  progression?: number
  images?: string[]
}

class StopMotion extends Component<Props, State> {
  state: State = {
    progression: 0,
    images: [],
    pProgression: 0,
    pImages: []
  }

  static getDerivedStateFromProps(props: Props, state: State): State {
    return {
      ...state,
      pImages: state.images,
      pProgression: state.progression,
      images: props.images ?? [],
      progression: props.progression ?? state.progression,
    }
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { images, progression } = this.state
    const clampedProgression = clamp(progression, 0, 1)
    const nbImages = images?.length ?? 0
    const trueProgresion = interpolate(clampedProgression, 0, nbImages - 1)
    const roundedProgression = Math.floor(trueProgresion)
    return <div className={styles['wrapper']}>
      {images?.map((imageUrl, imagePos) => {
        const isActive = imagePos === roundedProgression
        const imageClasses = [styles['frame']]
        if (isActive) imageClasses.push(styles['frame_active'])
        return <img className={imageClasses.join(' ')} src={imageUrl} />
      })}
    </div>
  }
}

export type { Props }
export default StopMotion
