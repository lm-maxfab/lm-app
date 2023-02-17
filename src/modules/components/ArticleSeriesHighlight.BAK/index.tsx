import { Component, VNode, JSX } from 'preact'
import bem from '../../utils/bem'
import ArticleThumb, { Props as ThumbProps } from '../ArticleThumb.BAK'
import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  title?: VNode|string
  paragraph?: VNode|string
  buttonContent?: VNode|string
  buttonUrl?: string
  buttonOpensNewTab?: boolean
  buttonClickHandler?: (e: JSX.TargetedMouseEvent<HTMLAnchorElement>) => void
  thumbsData?: ThumbProps[]
}

class ArticleSeriesHighlight extends Component<Props, {}> {
  static clss: string = 'lm-article-series-highlight'
  clss = ArticleSeriesHighlight.clss

  constructor (props: Props) {
    super(props)
    this.handleButtonClick = this.handleButtonClick.bind(this)
  }

  handleButtonClick (event: JSX.TargetedMouseEvent<HTMLAnchorElement>) {
    const { props } = this
    if (props.buttonClickHandler === undefined) return
    props.buttonClickHandler(event)
  }

  render () {
    const { props } = this

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {...props.style }

    return <div
    className={wrapperClasses.value}
    style={wrapperStyle}>
      <div className={bem(this.clss).elt('inner').value}>
        {props.title && <h3 className={bem(this.clss).elt('title').value}>{props.title}</h3>}
        {props.paragraph && <p className={bem(this.clss).elt('paragraph').value}>{props.paragraph}</p>}
        {props.buttonContent && <a
          href={props.buttonUrl}
          target={props.buttonOpensNewTab === true ? '_blank' : '_self'}
          onClick={this.handleButtonClick}
          className={bem(this.clss).elt('button').value}>
          {props.buttonContent}
          </a>}
        {props.thumbsData && <div className={bem(this.clss).elt('thumbs').value}>
          {props.thumbsData.map(thumbData => {
            return <div className={bem(this.clss).elt('thumb').value}>
              <ArticleThumb {...thumbData} />
            </div>
          })}
        </div>}
      </div>
    </div>
  }
}

export default ArticleSeriesHighlight
