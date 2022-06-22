import { Component } from 'preact'
import ArticleCredits from '../../components/ArticleCredits'
import ArticleHeader from '../../components/ArticleHeader'
import MediaCaption from '../../components/MediaCaption'
import MediaCredits from '../../components/MediaCredits'
import MediaDescription from '../../components/MediaDescription'
import bem from '../../utils/bem'

interface Props {
  className?: string
  style?: JSX.CSSProperties
}

interface State {}

export default class DemoPage extends Component<Props, State> {
  static clss: string = 'lm-layout-demo-page'
  clss = DemoPage.clss

  render () {
    const { props } = this

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      paddingTop: '35px'
    }

    return <div
      className={wrapperClasses.value}
      style={wrapperStyle}>
      <style>{`
        .${this.clss} > strong {
          font-family: var(--ff-marr-sans);
          font-size: 14px;
          color: #444;
          margin-top: 64px;
          display: block;
        }
        .${this.clss} > pre {
          font-size: 14px;
          color: #444;
          margin-bottom: 32px;
          display: block;
        }
      `}</style>

      <strong>ArticleCredits</strong>
      <pre>
        className?: string<br />
        style?: JSX.CSSProperties<br />
        content?: VNode|string<br />
      </pre>
      <ArticleCredits content='Article credits content' />

      <strong>ArticleHeader</strong>
      <pre>
        className?: string
        style?: JSX.CSSProperties
        fill1?: string
        fill2?: string
        fillTransitionTime?: string
      </pre>
      <ArticleHeader
        fill1='rgb(0, 0, 0)'
        fill2='rgb(0, 0, 0, .3)' />

      <strong>MediaDescription</strong>
      <pre>
        content?: VNode|string
      </pre>
      <MediaDescription content='Une description' />

      <strong>MediaCredits</strong>
      <pre>
        content?: VNode|string
      </pre>
      <MediaCredits content='Un crédit' />

      <strong>MediaCaption</strong>
      <pre>
        description?: VNode|string<br />
        credits?: VNode|string
      </pre>
      <MediaCaption
        description='Une description'
        credits='Un crédit' />
    </div>
  }
}