import { Component, VNode } from 'preact'
import ResponsiveDisplayer from '../../../modules/components/ResponsiveDisplayer'
import bem from '../../../modules/utils/bem'
import { LinkData } from '../../types'
import LinksBlock from '../LinksBlock'
import Separator from '../Separator'
import './styles.scss'

type Props = {
  title?: VNode|string
  paragraph?: VNode|string
  links?: LinkData[]
  mobileImageUrl?: string
}

export const className = bem('metoo-chapter-block')

export default class ChapterBlock extends Component<Props, {}> {
  render () {
    return <div className={className.value}>
      <div className={className.elt('top-bar').value}>
        <Separator />
      </div>
      <h3 className={className.elt('title').value}>
        {this.props.title}
      </h3>
      <LinksBlock links={this.props.links} />
      <div className={className.elt('bottom-bar').value}>
        <Separator />
      </div>
    </div>
  }
}
