import { Component, VNode } from 'preact'
import bem from '../../utils/bem'
import MediaDescription from '../MediaDescription'
import MediaCredits from '../MediaCredits'

export interface Props {
  className?: string
  style?: JSX.CSSProperties
  description?: VNode|string
  credits?: VNode|string
}

export default class MediaCaption extends Component<Props, {}> {
  static clss: string = 'lm-media-caption'
  clss = MediaCaption.clss

  render () {
    const { props } = this
    const { description, credits } = props

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {...props.style }

    return <figcaption
      className={wrapperClasses.value}
      style={wrapperStyle}>
      {description !== undefined && <><MediaDescription content={description} /></> }
      {description !== undefined && credits !== undefined && <> </>}
      {credits !== undefined && <MediaCredits content={credits} />}
    </figcaption>
  }
}
