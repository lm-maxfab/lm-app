import { Component } from 'preact'
import bem from '../../../modules/utils/bem'
import './styles.scss'

export const className = bem('metoo-separator')

export default class Separator extends Component<{}, {}> {
  render () {
    return <div className={className.value} />
  }
}
