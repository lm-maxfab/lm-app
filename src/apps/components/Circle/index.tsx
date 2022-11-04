import { Component, createRef } from 'preact'
import bem from '../../../modules/utils/bem'
import './styles.scss'

type Props = {
}

type State = {
  length?: number,
}

export const className = bem('mondial-circle')

export default class Circle extends Component<Props, State> {
  private svgCircle = createRef<SVGCircleElement>()

  state: State = {
    length: 0,
  }

  componentDidMount(): void {
    this.setState(curr => ({
      ...curr,
      length: this.svgCircle.current?.getTotalLength(),
    }))    
  }

  render () {
    const circleStyle: JSX.CSSProperties = { 
      ['--mondial-circle-length']: this.state.length,
     }

    return <svg style={circleStyle} className={className.value} width="1696" height="1696" viewBox="0 0 1696 1696" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle ref={this.svgCircle} cx="848" cy="848" r="828" stroke="#E9BE25" stroke-width="40"/>
    </svg>    
  }
}
