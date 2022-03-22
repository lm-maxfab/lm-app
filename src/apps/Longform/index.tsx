import { Component, JSX } from 'preact'
import ArticleHeader from '../../lm-app-modules/components/ArticleHeader'
import appWrapper, { InjectedProps } from '../../lm-app-modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import './styles.scss'

interface Props extends InjectedProps {}

class Longform extends Component<Props, {}> {
  static clss: string = 'template-longform'
  clss = Longform.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      fontSize: '48px',
      // margin: 'calc(var(--nav-height) + 32px) 32px 32px 32px',
      backgroundColor: 'blue'
    }

    const labelStyle = {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#777',
      marginTop: '32px'
    }

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>

      <ArticleHeader />

      <p style={labelStyle}>The Antiqua B — 500</p>
      <p style={{ fontFamily: 'var(--ff-the-antiqua-b)', fontWeight: '500' }}>The quick brown fox jumps over the lazy dog</p>

      <p style={labelStyle}>The Antiqua B — 500 italic</p>
      <p style={{ fontFamily: 'var(--ff-the-antiqua-b)', fontWeight: '500', fontStyle: 'italic' }}>The quick brown fox jumps over the lazy dog</p>

      <p style={labelStyle}>The Antiqua B — 700</p>
      <p style={{ fontFamily: 'var(--ff-the-antiqua-b)', fontWeight: '700' }}>The quick brown fox jumps over the lazy dog</p>

      <p style={labelStyle}>The Antiqua B — 700 italic</p>
      <p style={{ fontFamily: 'var(--ff-the-antiqua-b)', fontWeight: '700', fontStyle: 'italic' }}>The quick brown fox jumps over the lazy dog</p>

      <p style={labelStyle}>The Antiqua B — 800</p>
      <p style={{ fontFamily: 'var(--ff-the-antiqua-b)', fontWeight: '800' }}>The quick brown fox jumps over the lazy dog</p>

      <p style={labelStyle}>Marr Sans — 400</p>
      <p style={{ fontFamily: 'var(--ff-marr-sans)', fontWeight: '400' }}>The quick brown fox jumps over the lazy dog</p>

      <p style={labelStyle}>Marr Sans — 500</p>
      <p style={{ fontFamily: 'var(--ff-marr-sans)', fontWeight: '500' }}>The quick brown fox jumps over the lazy dog</p>

      <p style={labelStyle}>Marr Sans — 600</p>
      <p style={{ fontFamily: 'var(--ff-marr-sans)', fontWeight: '600' }}>The quick brown fox jumps over the lazy dog</p>

      <p style={labelStyle}>Marr Sans — 700</p>
      <p style={{ fontFamily: 'var(--ff-marr-sans)', fontWeight: '700' }}>The quick brown fox jumps over the lazy dog</p>

      <p style={labelStyle}>Marr Sans — 900</p>
      <p style={{ fontFamily: 'var(--ff-marr-sans)', fontWeight: '900' }}>The quick brown fox jumps over the lazy dog</p>

      <p style={labelStyle}>Marr Sans Condensed — 500</p>
      <p style={{ fontFamily: 'var(--ff-marr-sans-condensed)', fontWeight: '500' }}>The quick brown fox jumps over the lazy dog</p>

      <p style={labelStyle}>Marr Sans Condensed — 600</p>
      <p style={{ fontFamily: 'var(--ff-marr-sans-condensed)', fontWeight: '600' }}>The quick brown fox jumps over the lazy dog</p>

      <p style={labelStyle}>Marr Sans Condensed — 700</p>
      <p style={{ fontFamily: 'var(--ff-marr-sans-condensed)', fontWeight: '700' }}>The quick brown fox jumps over the lazy dog</p>

      <p style={labelStyle}>Fette Engschrift — 500</p>
      <p style={{ fontFamily: 'var(--ff-fette-engschrift)', fontWeight: '500' }}>The quick brown fox jumps over the lazy dog</p>
    </div>
  }
}

export type { Props, Longform }
export default appWrapper(Longform)
