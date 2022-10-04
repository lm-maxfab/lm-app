import { Component } from 'preact'
import Svg from '../../../modules/components/Svg'
import bem from '../../../modules/utils/bem'
import { LinkData } from '../../types'
import './styles.scss'
import arrowAssetUrl from '../assets/arrow.svg'
import bulletAssetUrl from '../assets/bullet.svg'

type Props = LinkData & {}

export const className = bem('metoo-link')

export default class Link extends Component<Props, {}> {
  render () {
    const wrapperClassName = className.mod({
      secondary: this.props.is_primary === undefined || this.props.is_primary === false,
      unpublished: this.props.is_published === undefined || this.props.is_published === false
    })
    return <a
      href={this.props.is_published ? this.props.url : undefined}
      className={wrapperClassName.value}>
      <div className={className.elt('bullet').value}>
        {this.props.is_primary && <Svg src={arrowAssetUrl} />}
        {!this.props.is_primary && <Svg src={bulletAssetUrl} />}
      </div>
      <div className={className.elt('content').value}>
        <div className={className.elt('title').value}>{this.props.title}</div>
        <div className={className.elt('kicker').value}>{this.props.kicker}</div>
        <div className={className.elt('teaser').value}>{this.props.pre_publication_label}</div>
      </div>
    </a>
  }
}
