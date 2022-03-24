import { Component, JSX } from 'preact'
import bem from '../../utils/bem'
import Svg from '../Svg'
import logoUrl from './logo.svg'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  fill1?: string
  fill2?: string
  fillTransitionTime?: string
}

class ArticleHeader extends Component<Props, {}> {
  static clss = 'lm-article-header'
  clss = ArticleHeader.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Classes and style */
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      '--fill-1': props.fill1 ?? '#FFFFFF',
      '--fill-2': props.fill2 ?? 'rgb(255, 255, 255, .6)',
      '--fill-transition-time': props.fillTransitionTime ?? '600ms'
    }

    /* Display */
    return (
      <div className={wrapperClasses.value} style={wrapperStyle}>
        <a href='https://lemonde.fr'>
          <Svg
            src={logoUrl}
            className={bem(this.clss).elt('logo').value} />
        </a>
      </div>
    )
  }
}

export type { Props }
export default ArticleHeader
