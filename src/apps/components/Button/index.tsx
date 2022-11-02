import { Component } from 'preact'
import bem from '../../../modules/utils/bem'
import './styles.scss'

type Props = {
  light?: boolean
}

type State = {
}

export const className = bem('mondial-button')

export default class Button extends Component<Props, State> {
  render () {

    const buttonClasses = className.mod({
      'light': this.props.light
    })

    return <div 
      className={buttonClasses.value}>

        <span>{this.props.children}</span>

    </div>
  }
}
