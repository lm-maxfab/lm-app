import { Component, JSX } from 'preact'
import './style.css'
// import { Parser } from 'html-to-react'
// const h2r = new Parser()

interface Props {
  content?: string
}

class StrToHtml extends Component<Props, {}> {
  mainClass = 'lm-str-to-html'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this
    // const parsed = h2r.parse(props.content ?? '')
    // return <>{parsed}</>
    return <div
      className={`${this.mainClass}`}
      dangerouslySetInnerHTML={{ __html: props.content ?? '' }} />
  }
}

export default StrToHtml
