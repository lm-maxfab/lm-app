import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../wrapper'
import bem from '../../modules/le-monde/utils/bem'
import './styles.scss'
import ArticleHeader from '../../modules/le-monde/components/ArticleHeader'
import ArticleCredits from '../../modules/le-monde/components/ArticleCredits'
import Carousel from '../../modules/le-monde/components/Carousel'

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
