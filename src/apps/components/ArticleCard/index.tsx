import { Component, VNode } from 'preact'
import bem from '../../../modules/utils/bem'
import './styles.scss'

interface Props {
  overhead?: VNode|string
  title?: VNode|string
  kicker?: VNode|string
  buttonText?: VNode|string
  activeButtons?: boolean
  inactiveButtonText?: string
  buttonTargetUrl?: string
}

export default class ArticleCard extends Component<Props, {}> {
  static clss = 'sable-article-card'
  clss = ArticleCard.clss

  constructor (props: Props) {
    super(props)
    this.handleButtonClick = this.handleButtonClick.bind(this)
  }

  handleButtonClick () {
    const { buttonTargetUrl, activeButtons } = this.props
    if (!activeButtons || buttonTargetUrl === undefined) return
    window.location.href = buttonTargetUrl
  }

  render () {
    const {
      overhead,
      title,
      kicker,
      buttonText,
      activeButtons,
      inactiveButtonText
    } = this.props

    const wrapperClasses = bem(this.clss).mod({ 'inactive-buttons': !activeButtons })

    return <div className={wrapperClasses.value}>
      {overhead && <div className={bem(this.clss).elt('overhead').value}><span>{overhead}</span></div>}
      {title && <h3 className={bem(this.clss).elt('title').value}>{title}</h3>}
      {kicker && activeButtons && <div className={bem(this.clss).elt('kicker').value}>{kicker}</div>}
      {buttonText && activeButtons && <button
        disabled={!activeButtons}
        className={bem(this.clss).elt('button').value}
        onClick={this.handleButtonClick}>
        {activeButtons ? buttonText : inactiveButtonText}
      </button>}
      {!activeButtons && <div className={bem(this.clss).elt('read-later').value}><span>{inactiveButtonText}</span></div>}
    </div>
  }
}
