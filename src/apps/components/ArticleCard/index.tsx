import { Component, VNode } from 'preact'
import bem from '../../../modules/utils/bem'
import './styles.scss'

interface Props {
  overhead?: VNode|string
  title?: VNode|string
  buttonText?: VNode|string
}

(window as any).bem = bem

export default class ArticleCard extends Component<Props, {}> {
  static clss = 'sable-article-card'
  clss = ArticleCard.clss

  render () {
    const { overhead, title, buttonText } = this.props

    const wrapperClasses = bem(this.clss)

    return <div className={wrapperClasses.value}>
      {overhead && <div>{overhead}</div>}
      {title && <h3>{title}</h3>}
      {buttonText && <button>{buttonText}</button>}
    </div>
  }
}
