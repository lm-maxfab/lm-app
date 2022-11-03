import { Component } from 'preact'
import bem from '../../../modules/utils/bem'
import './styles.scss'

type Props = {
}

type State = {
}

export const className = bem('mondial-circle')

export default class Circle extends Component<Props, State> {
  render () {
    return <svg className={className.value} width="1696" height="1696" viewBox="0 0 1696 1696" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="848" cy="848" r="828" stroke="#E9BE25" stroke-width="40"/>
    </svg>    
  }
}
