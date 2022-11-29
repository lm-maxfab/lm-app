import { Component } from 'preact'

export type BlockContext = {
  width?: number|undefined
  height?: number|undefined
}

type moduleRenderer = {
  init: (props: BlockContext) => HTMLElement
  update: (wrapper: HTMLElement, props: BlockContext) => HTMLElement
}

type Props = {
  type?: 'module'|'html'
  content?: string
  context?: BlockContext
}

type State = {
  moduleUrl: string|null
  moduleIsLoading: boolean
  moduleLoadError: any
  moduleRenderer: moduleRenderer|null
  moduleTarget: HTMLElement|null
}

export default class BlockRenderer extends Component<Props, State> {
  $moduleWrapper: HTMLElement|null = null
  state: State = {
    moduleUrl: null,
    moduleIsLoading: false,
    moduleLoadError: null,
    moduleRenderer: null,
    moduleTarget: null
  }

  constructor (props: Props) {
    super(props)
    this.loadModule = this.loadModule.bind(this)
    this.initModule = this.initModule.bind(this)
    this.updateModule = this.updateModule.bind(this)
    if (props.type === 'module') console.log('BLKRDR - CONSTRUCT', props.context)
  }

  componentDidMount () {
    const { type, content } = this.props
    if (type !== 'module' || content === undefined) return
    console.log('BLKRDR - DID MOUNT', this.props.context)
    this.loadModule(content)
    if (this.$moduleWrapper === null) return
    const { moduleTarget } = this.state
    if (moduleTarget === null) {
      this.initModule()
      return this.$moduleWrapper.replaceChildren()
    }
    this.updateModule(moduleTarget)
    return this.$moduleWrapper.replaceChildren(moduleTarget)
  }

  componentDidUpdate () {
    const { type, content } = this.props
    if (type !== 'module' || content === undefined) return
    console.log('BLKRDR - DID UPDATE', this.props.context)
    if (this.state.moduleUrl !== content) this.loadModule(content)
    if (this.$moduleWrapper === null) return
    const { moduleTarget } = this.state
    if (moduleTarget === null) {
      this.initModule()
      return this.$moduleWrapper.replaceChildren()
    }
    this.updateModule(moduleTarget)
    return this.$moduleWrapper.replaceChildren(moduleTarget)
  }

  async loadModule (url: string) {
    const { props, state } = this
    if (state.moduleIsLoading) return
    await new Promise((resolve) => {
      this.setState(curr => ({
        ...curr,
        moduleUrl: url,
        moduleIsLoading: true,
        moduleLoadError: null,
        moduleRenderer: null,
        moduleTarget: null
      }), () => resolve(true))
    })
    try {
      const rawModule = await import(url)
      const hasInit = typeof rawModule.init === 'function'
      const hasUpdate = typeof rawModule.update === 'function'
      if (!hasInit) throw new Error('Module has no exported function named init')
      if (!hasUpdate) throw new Error('Module has no exported function named update')
      const module = rawModule as moduleRenderer
      const moduleContext = props.context
      console.log('BLKRDR - LOAD MODULE', moduleContext)
      this.initModule()
      await new Promise((resolve) => {
        this.setState(curr => ({
          ...curr,
          moduleUrl: url,
          moduleIsLoading: false,
          moduleLoadError: null,
          moduleRenderer: module
        }), () => resolve(true))
      })
    } catch (err) {
      await new Promise((resolve) => {
        this.setState(curr => ({
          ...curr,
          moduleUrl: url,
          moduleIsLoading: false,
          moduleLoadError: err,
          moduleRenderer: null,
          moduleTarget: null
        }), () => resolve(true))
      })
    }
  }

  initModule () {
    const { props, state } = this
    const { context } = props
    console.log('BLKRDR - INIT MODULE', context)
    const { moduleRenderer } = state
    if (moduleRenderer === null) return null
    if (typeof moduleRenderer.init !== 'function') return null
    const moduleTarget = moduleRenderer.init(context ?? {})
    return this.setState(curr => ({ ...curr, moduleTarget }))
  }

  updateModule (target: HTMLElement) {
    const { props, state } = this
    const { context } = props
    console.log('BLKRDR - UPDATE MODULE', context)
    const { moduleRenderer } = state
    if (moduleRenderer === null) return null
    if (typeof moduleRenderer.update !== 'function') return null
    const moduleTarget = moduleRenderer.update(target, context ?? {})
    this.setState(curr => ({ ...curr, moduleTarget }))
  }

  render () {
    const { props, state } = this
    const content = props.content ?? ''
    console.log('BLKRDR - RENDER', props.context)

    switch (props.type) {
      case 'html':
      case undefined:
        return <div dangerouslySetInnerHTML={{ __html: content }} />
      case 'module':
        const isLoading = state.moduleIsLoading
        const hasErrors = !isLoading && state.moduleLoadError !== null
        const hasTarget = !isLoading && !hasErrors && state.moduleTarget !== null
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
