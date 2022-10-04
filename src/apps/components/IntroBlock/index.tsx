import { Component, VNode } from 'preact'
import bem from '../../../modules/utils/bem'
import Separator from '../Separator'
import './styles.scss'

type Props = {
  heading?: VNode|string
  kicker?: VNode|string
  paragraph?: VNode|string
}

export const className = bem('metoo-intro-block')

export default class IntroBlock extends Component<Props, {}> {
  render () {
    return <div className={className.value}>
      <h1 className={className.elt('heading').value}>{this.props.heading}</h1>
      <div className={className.elt('separator').value}>
        <Separator color='black' />
      </div>
      <p className={className.elt('kicker').value}>{this.props.kicker}</p>
      <div className={className.elt('content-spacer').value}></div>
      <p className={className.elt('paragraph').value}>{this.props.paragraph}</p>
    </div>
  }
}
