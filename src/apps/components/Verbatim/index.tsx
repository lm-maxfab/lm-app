import { Component, VNode } from 'preact'
import Svg from '../../../modules/components/Svg'
import './styles.scss'
import arrowSvg from './arrow.svg'

interface Props {
  imageUrl?: string
  verbatimAuthor?: VNode|string
  verbatimAuthorRole?: VNode|string
  content?: VNode|string
  contrastColor?: string
  textColor?: string
  borderColor?: string
  bgColor?: string
}

class Verbatim extends Component<Props, {}> {
  render () {
    const { props } = this
    const cssVars = {
      '--border-color': props.borderColor,
      '--bg-color': props.bgColor
    }
    return <div
      className='verbatim'
      style={cssVars}>
      <img src={props.imageUrl} />
      <h3 style={{ color: props.contrastColor }}>
        {props.verbatimAuthor && <strong>{props.verbatimAuthor}</strong>}
        {props.verbatimAuthorRole && <> | {props.verbatimAuthorRole}</>}
      </h3>
      <p style={{ color: props.textColor }}>{props.content}</p>
      <Svg src={arrowSvg} />
    </div>
  }
}

export default Verbatim
