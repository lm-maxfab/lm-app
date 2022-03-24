import { Component, JSX } from 'preact'
import Img from '../../../modules/components/Img'
import bem from '../../../modules/utils/bem'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  list?: string[]
  current?: string
}

interface State {
  previous?: string
}

class ImageFader extends Component<Props, State> {
  static clss = 'carto-twitter-image-fader'
  clss = ImageFader.clss
  state: State = { previous: undefined }
  previousImage?: string

  getSnapshotBeforeUpdate (prevProps: Props): null {
    if (prevProps.current === this.props.current) return null
    this.previousImage = prevProps.current
    return null
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Classes and style */
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    /* Display */
    return (
      <div className={wrapperClasses.value} style={wrapperStyle}>
        {props.list?.map(url => {
          const imageBem = bem(this.clss).elt('image')
          if (url === props.current) imageBem.addModifier('active')
          else if (url === this.previousImage) imageBem.addModifier('previous')
          else imageBem.addModifier('passed')
          return <Img src={url} className={imageBem.value} />
        })}
      </div>
    )
  }
}

export type { Props, State }
export default ImageFader
