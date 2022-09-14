import { Component, JSX } from 'preact'
import ArticleHeader from '../../modules/components/ArticleHeader'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import Backbone from '../Backbone'
import './styles.scss'

interface Props extends InjectedProps {}

class Longform extends Component<Props, {}> {
  static clss: string = 'queen-longform'
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
      position: 'relative'
    }

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      <ArticleHeader
        style={{ zIndex: 2, position: 'fixed' }}
        fill1='white'
        fill2='rgb(255, 255, 255, .3)' />
      <div style={{ zIndex: 1, position: 'relative' }}>
        <Backbone
          slotName='longform'
          sheetBase={props.sheetBase} />
      </div>
    </div>
  }
}

export type { Props, Longform }
export default appWrapper(Longform)
