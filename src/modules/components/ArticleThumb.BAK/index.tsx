import { Component, VNode } from 'preact'
import bem from '../../utils/bem'
import Img from '../Img'
import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  bgImageUrl?: string
  title?: VNode|string
  articleUrl?: string
  openNewTab?: boolean
  filterColor?: JSX.CSSProperties['backgroundColor']
  filterColorHover?: JSX.CSSProperties['backgroundColor']
}

class ArticleThumb extends Component<Props, {}> {
  static clss: string = 'lm-article-thumb'
  clss = ArticleThumb.clss

  render () {
    const { props } = this

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {...props.style }

    return <a
      className={wrapperClasses.value}
      style={wrapperStyle}
      href={props.articleUrl}
      target={props.openNewTab === true ? '_blank' : '_self'}>
      <div className={bem(this.clss).elt('inner').value}>
        <Img
          src={props.bgImageUrl}
          className={bem(this.clss).elt('bg-image').value} />
        <div
          style={{
            '--filter-color': props.filterColor,
            '--hover-filter-color': props.filterColorHover ?? props.filterColor
          }}
          className={bem(this.clss).elt('color-filter').value} />
        <div className={bem(this.clss).elt('text-info').value}>
          <div className={bem(this.clss).elt('title').value}>
            {props.title}
          </div>
        </div>
      </div>
    </a>
  }
}

export type { Props }
export default ArticleThumb
