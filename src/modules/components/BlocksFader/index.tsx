import { Component, VNode } from 'preact'
import bem from '../../utils/bem'

interface BlockDescriptor {
  content?: VNode|string
  style_variants?: string
}

interface Props {
  className?: string
  style?: JSX.CSSProperties
  blocks?: BlockDescriptor[]
  current?: BlockDescriptor
}

export default class BlocksFader extends Component<Props, {}> {
  static clss = 'lm-blocks-fader'
  clss = BlocksFader.clss

  render () {
    const { props } = this

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      {props.blocks?.map(block => block.content)}
    </div>
  }
}
