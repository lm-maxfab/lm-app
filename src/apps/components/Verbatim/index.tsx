import { Component, VNode } from 'preact'
import './styles.scss'
import separatorUrl from './side-separator.png'
import bem from '../../../modules/utils/bem'

interface Props {
  imageUrl?: string
  verbatimAuthor?: VNode|string
  verbatimAuthorRole?: VNode|string
  content?: VNode|string
}

class Verbatim extends Component<Props, {}> {
  static clss = 'verbatim'
  clss = Verbatim.clss

  render () {
    const { props } = this
    return <div className='verbatim'>
      <div className={bem(this.clss).elt('left').value}>
        <img src={props.imageUrl} className={bem(this.clss).elt('author-image').value} />
        <h3 className={bem(this.clss).elt('author-text').value}>
          {props.verbatimAuthor && <div className={bem(this.clss).elt('author-name').value}>{props.verbatimAuthor}</div>}
          {props.verbatimAuthorRole && <div className={bem(this.clss).elt('author-role').value}>{props.verbatimAuthorRole}</div>}
        </h3>
      </div>
      <div className={bem(this.clss).elt('right').value}>
        <div
          className={bem(this.clss).elt('separator').value}
          style={{ backgroundImage: `url(${separatorUrl})` }} />
        <p className={bem(this.clss).elt('text').value}>{props.content}</p>
      </div>
    </div>
  }
}

export default Verbatim
