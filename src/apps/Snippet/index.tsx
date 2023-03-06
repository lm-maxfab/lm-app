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
interface State {
  id: number | undefined
}

class Snippet extends Component<Props, State> {
  container: any
  idCheck: any

  state: State = {
    id: undefined
  }

  constructor() {
    super()

    this.container = createRef()
    this.idCheck = undefined
    this.setSnippetId = this.setSnippetId.bind(this)
  }

  componentDidMount(): void {
    this.setSnippetId()

    if (this.state.id === undefined) {
      this.idCheck = window.setInterval(this.setSnippetId, 500)
    }
  }

  setSnippetId(): void {
    if (this.state.id === undefined) this.setState({ id: this.getSnippetId() })
  }

  getSnippetId(): number | undefined {
    if (this.container.current === null || this.container.current === undefined) return undefined

    const parent = this.container.current.closest('.lm-app-root')

    if (parent === null || parent === undefined) return undefined

    const parentClassList = parent.classList.value.split(' ')
    const snippetClass = parentClassList.find((el: string) => el.startsWith('lm-snippet'))
    const snippetId = snippetClass.split('-').slice(-1)[0]

    window.clearInterval(this.idCheck)

    return snippetId
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render(): JSX.Element {
    const { props, state } = this

    const dataIndex = state.id ? state.id - 1 : 0
    const data = props.sheetBase?.collection('data').value[dataIndex] as unknown as SnippetData;

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

    const portraitUrl = `https://assets-decodeurs.lemonde.fr/redacweb/42-2303-feministes-medias/portrait-${state.id ?? 0}.png`

    return <div ref={this.container} className={wrapperClasses.join(' ')}>
      {state.id && <>
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
      </>}
    </div>
  }
}

export type { Props, Snippet }
export default appWrapper(Snippet)
