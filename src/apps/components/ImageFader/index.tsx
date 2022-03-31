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

class ImageFader extends Component<Props, {}> {
  static clss = 'carto-twitter-image-fader'
  clss = ImageFader.clss
  previousImage?: string

  shouldComponentUpdate (nextProps: Props): boolean {
    if (this.props.current === nextProps.current) return false
    this.previousImage = this.props.current
    return true
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Classes and style */
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    console.log('prev:', this.previousImage)
    console.log('curr:', props.current)
    console.log('----')

    /* Display */
    return (
      <div className={wrapperClasses.value} style={wrapperStyle}>
        {props.list?.map(url => {
          const imageBem = bem(this.clss).elt('image')
          if (props.current === undefined) imageBem.addModifier('passed')
          else {
            if (url === props.current) imageBem.addModifier('active')
            else if (url === this.previousImage) imageBem.addModifier('previous')
            else imageBem.addModifier('passed')
          }
          return <Img src={url} className={imageBem.value} />
        })}
      </div>
    )
  }
}

export type { Props }
export default ImageFader
