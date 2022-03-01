import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../lm-app-modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import './styles.scss'
import ArticleHeader from '../../lm-app-modules/components/ArticleHeader'
import ArticleCredits from '../../lm-app-modules/components/ArticleCredits'
import Carousel from '../../modules/components/Carousel'

interface Props extends InjectedProps {}
interface State {}

class Longform extends Component<Props, State> {
  static clss: string = 'template-longform'
  clss = Longform.clss
  state: State = {}

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    // Display
    return <div 
      style={wrapperStyle}
      className={wrapperClasses.value}>
      <ArticleHeader />
      <Carousel />
      <ArticleCredits content='Credits.' />
    </div>
  }
}

export type { Props, Longform }
export default appWrapper(Longform)
