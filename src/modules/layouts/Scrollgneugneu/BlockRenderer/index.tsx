import { Component } from 'preact'
import styles from './styles.module.scss'

type RendererModule = {
  init: (props: any) => HTMLElement
  update: (wrapper: HTMLElement, props: any) => void
}

type Props = {
  type?: 'module'|'html'
  content?: string
}

type State = {
  rendererUrl: string|null
  rendererIsLoading: boolean
  rendererLoadError: any
  rendererModule: RendererModule|null
  rendererTarget: HTMLElement|null
}

export default class BlockRenderer extends Component<Props, State> {
  $moduleWrapper: HTMLElement|null = null
  state: State = {
    rendererUrl: null,
    rendererIsLoading: false,
    rendererLoadError: null,
    rendererModule: null,
    rendererTarget: null
  }

  componentDidMount () {
    const { type, content } = this.props
    if (type !== 'module' || content === undefined) return
    this.loadRenderer(content)
    if (this.$moduleWrapper === null) return
    const { rendererTarget } = this.state
    if (rendererTarget === null) return this.$moduleWrapper.replaceChildren()
    return this.$moduleWrapper.replaceChildren(rendererTarget)
  }

  componentDidUpdate () {
    const { type, content } = this.props
    if (type !== 'module' || content === undefined) return
    if (this.state.rendererUrl !== content) this.loadRenderer(content)
    if (this.$moduleWrapper === null) return
    const { rendererTarget } = this.state
    if (rendererTarget === null) return this.$moduleWrapper.replaceChildren()
    return this.$moduleWrapper.replaceChildren(rendererTarget)
  }

  async loadRenderer (url: string) {
    const { state } = this
    if (state.rendererIsLoading) return
    await new Promise((resolve) => {
      this.setState(curr => ({
        ...curr,
        rendererUrl: url,
        rendererIsLoading: true,
        rendererLoadError: null,
        rendererModule: null,
        rendererTarget: null
      }), () => resolve(true))
    })
    try {
      const rawModule = await import(url)
      const hasInit = typeof rawModule.init === 'function'
      const hasUpdate = typeof rawModule.update === 'function'
      if (!hasInit) throw new Error('Module has no exported function named init')
      if (!hasUpdate) throw new Error('Module has no exported function named update')
      const module = rawModule as RendererModule
      const rendererTarget = module.init({})
      await new Promise((resolve) => {
        this.setState(curr => ({
          ...curr,
          rendererUrl: url,
          rendererIsLoading: false,
          rendererLoadError: null,
          rendererModule: module,
          rendererTarget
        }), () => resolve(true))
      })
    } catch (err) {
      await new Promise((resolve) => {
        this.setState(curr => ({
          ...curr,
          rendererUrl: url,
          rendererIsLoading: false,
          rendererLoadError: err,
          rendererModule: null,
          rendererTarget: null
        }), () => resolve(true))
      })
    }
  }

  render () {
    const { props, state } = this
    const content = props.content ?? ''

    switch (props.type) {
      case 'html':
      case undefined:
        return <div dangerouslySetInnerHTML={{ __html: content }} />
      case 'module':
        const isLoading = state.rendererIsLoading
        const hasErrors = !isLoading && state.rendererLoadError !== null
        const hasTarget = !isLoading && !hasErrors && state.rendererTarget !== null
        return <div>
          {isLoading && <div>Loading...</div>}
          {hasErrors && <div>Something went wrong while fetching the module.</div>}
          {hasTarget && <div ref={n => { this.$moduleWrapper = n }} />}
        </div>
      default:
        return <div>Block type {props.type} is unknown</div>
    }
  }
}
