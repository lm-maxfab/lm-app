import { Component, JSX, VNode, createRef } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import styles from './styles.module.scss'

interface SnippetData {
  quote: VNode | string
  name: string
  bio: VNode | string
  portrait: string
}

interface Props extends InjectedProps { }
interface State { }

class Snippet extends Component<Props, State> {
  container: any
  id: number

  constructor() {
    super()

    this.container = createRef()
    this.id = 1
  }

  componentDidMount(): void {
    const parent = this.container.current.closest('.lm-app-root')
    const parentClassList = parent.classList.value.split(' ')
    const snippetClass = parentClassList.find((el: string) => el.startsWith('lm-snippet'))

    this.id = snippetClass.split('-').slice(-1)[0]
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render(): JSX.Element {


    const { props } = this


    const data = props.sheetBase?.collection('data').value[this.id - 1] as unknown as SnippetData;

    const wrapperClasses = [
      styles['wrapper']
    ]

    const quoteClasses = [
      styles['quote']
    ]

    const authorClasses = [
      styles['author']
    ]

    const nameClasses = [
      styles['name']
    ]

    const bioClasses = [
      styles['bio']
    ]

    const portraitClasses = [
      styles['portrait']
    ]

    const portraitUrl = `https://assets-decodeurs.lemonde.fr/redacweb/42-2303-feministes-medias/portrait-${this.id}.png`

    return <div ref={this.container} className={wrapperClasses.join(' ')}>
      <p className={quoteClasses.join(' ')}>« {data.quote} »</p>

      <div className={authorClasses.join(' ')}>
        <img
          src={portraitUrl}
          alt={data.name as string}
          className={portraitClasses.join(' ')}
        />

        <div>
          <p className={nameClasses.join(' ')}>{data.name}</p>
          <p className={bioClasses.join(' ')}>{data.bio}</p>
        </div>
      </div>
    </div>
  }
}

export type { Props, Snippet }
export default appWrapper(Snippet)
