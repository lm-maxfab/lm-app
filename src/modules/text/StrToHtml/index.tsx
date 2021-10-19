import { Component, JSX } from 'preact'
import './style.css'

interface Props {
  content?: string
  wrapperTag?: 'div'|'span'
}

class StrToHtml extends Component<Props, {}> {
  mainClass = 'lm-str-to-html'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this
    const Wrapper = props.wrapperTag === 'div'
      || props.wrapperTag === undefined
      ? (props: JSX.HTMLAttributes<HTMLDivElement>) => <div {...props} />
      : (props: JSX.HTMLAttributes<HTMLSpanElement>) => <span {...props} />

    return <Wrapper
      className={`${this.mainClass}`}
      dangerouslySetInnerHTML={{ __html: props.content ?? '' }} />
  }
}

export default StrToHtml
