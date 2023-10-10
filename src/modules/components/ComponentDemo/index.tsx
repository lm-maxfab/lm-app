import { Component, VNode } from 'preact'
import bem from '../../utils/bem'
import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  name?: string
  description?: string
  propsDescription?: string
  component?: VNode
  componentMaxWidth?: JSX.CSSProperties['maxWidth']
}

export default class ComponentDemo extends Component<Props, {}> {
  static clss: string = 'lm-component-demo'
  clss = ComponentDemo.clss

  render () {
    const { props } = this

    // Logic
    const readablePropsDesc = props.propsDescription
      ?.trim()
      .split('\n')
      .map(line => line.trim())
      .join('\n')

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      paddingTop: '35px'
    }

    return <div
      className={wrapperClasses.value}
      style={wrapperStyle}>
      {props.name && <div className={bem(this.clss).elt('name').value}>
        {props.name}
      </div>}
      {props.description && <div className={bem(this.clss).elt('description').value}>
        {props.description}
      </div>}
      {readablePropsDesc && <pre className={bem(this.clss).elt('props-description').value}>
        {readablePropsDesc}
      </pre>}
      {props.component && <div
        className={bem(this.clss).elt('component').value}
        style={{ maxWidth: props.componentMaxWidth }}>
        <div className={bem(this.clss).elt('component-inner').value}>
          {props.component}
        </div>
      </div>}
    </div>
  }
}
