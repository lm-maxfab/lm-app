import { Component } from 'preact'
import { BlockContext, createBlockContext } from '..'

type ModuleData = {
  init: (props: BlockContext) => HTMLElement
  update: (wrapper: HTMLElement, context: BlockContext, prevContext: BlockContext) => void
  styles?: string[]
  // [WIP] libs
}

type Props = {
  type?: 'module'|'html'
  content?: string
  context?: BlockContext
  prevContext?: BlockContext
  cssLoader?: (url: string) => Promise<void>
}

type State = {
  moduleLoading: boolean
  moduleLoadErrors: Error|null
  moduleData: ModuleData|null
  moduleTarget: HTMLElement|null
}

type StateSetter = ((s: State) => (State|null))|Partial<State>

export default class BlockRenderer extends Component<Props, State> {
  $moduleWrapper: HTMLDivElement|null = null
  state: State = {
    moduleLoading: false,
    moduleLoadErrors: null,
    moduleData: null,
    moduleTarget: null
  }

  constructor (props: Props) {
    super(props)
    this.aSetState = this.aSetState.bind(this)
    this.loadModule = this.loadModule.bind(this)
    this.initModule = this.initModule.bind(this)
    this.loadInitModule = this.loadInitModule.bind(this)
    this.updateModule = this.updateModule.bind(this)
    this.attachModuleTarget = this.attachModuleTarget.bind(this)
  }

  componentDidMount (): void {
    const {
      props,
      loadInitModule,
      attachModuleTarget
    } = this
    const { type } = props
    if (type !== 'module') return;
    loadInitModule()
    attachModuleTarget()
  }

  componentDidUpdate(pProps: Readonly<Props>): void {
    const {
      props,
      loadInitModule,
      updateModule,
      attachModuleTarget
    } = this
    const { type, content } = props
    const { type: pType, content: pContent } = pProps
    if (type !== pType || content !== pContent) loadInitModule()
    else updateModule()
    attachModuleTarget()
  }

  async aSetState (stateSetter: StateSetter): Promise<StateSetter> {
    return new Promise(resolve => {
      const resolver = () => resolve(stateSetter)
      return this.setState(stateSetter, resolver)
    })
  }

  async loadModule () {
    const { props, state } = this
    const { type, content, cssLoader } = props
    const { moduleLoading } = state
    if (type !== 'module' || content === undefined) return;
    if (moduleLoading) return;
    await this.aSetState(curr => ({ ...curr, moduleLoading: true }))
    const moduleUrl = content
    try {
      // [WIP] sketchy casts to any below
      const importedData = (await import(/* @vite-ignore */moduleUrl)) as unknown
      const importedIsNotObject = typeof importedData !== 'object'
      const importedIsNullish = importedData === null || importedData === undefined
      if (importedIsNotObject || importedIsNullish) throw new Error('Imported module is not an object')      
      const importedHasInitFunc = 'init' in importedData && typeof (importedData as any).init === 'function'
      const importedHasUpdateFunc = 'update' in importedData && typeof (importedData as any).update === 'function'
      const importedHasStyles = 'styles' in importedData
        && Array.isArray((importedData as any).styles)
        && ((importedData as any)?.styles as unknown[]|undefined)?.every(url => typeof url === 'string')
      if (!importedHasInitFunc) throw new Error('Imported module must export a function named init')
      if (!importedHasUpdateFunc) throw new Error('Imported module must export a function named update')
      const moduleData = importedData as ModuleData
      if (cssLoader !== undefined && importedHasStyles) {
        // [WIP] do better than cast? 
        // [WIP] try multiple times if load fails?
        ((importedData as any).styles as string[]).forEach(url => cssLoader(url))
      }
      await this.aSetState(curr => ({ ...curr, moduleLoading: false, moduleLoadErrors: null, moduleData }))
    } catch (err: unknown) {
      let moduleLoadErrors: Error = new Error('Unknown error')
      if (err instanceof Error) moduleLoadErrors = err
      else if (typeof err === 'string') moduleLoadErrors = new Error(err)
      await this.aSetState(curr => ({ ...curr, moduleLoading: false, moduleLoadErrors }))
    } 
  }

  async initModule () {
    const { props, state } = this
    const { context } = props
    const { moduleData } = state
    if (moduleData === null) return;
    const moduleTarget = moduleData.init(context ?? createBlockContext({})) as unknown
    const targetIsHTMLElement = moduleTarget instanceof HTMLElement
    if (!targetIsHTMLElement) {
      const errorStr = 'Imported module init exported function should return a HTMLElement object'
      return await this.aSetState(curr => ({ ...curr, moduleLoadErrors: new Error(errorStr) }))
    }
    return await this.aSetState(curr => ({ ...curr, moduleLoadErrors: null, moduleTarget }))
  }

  async loadInitModule () {
    await this.loadModule()
    await this.initModule()
  }

  async updateModule () {
    const { props, state } = this
    const { context, prevContext } = props
    const { moduleData, moduleTarget } = state
    if (moduleData === null || moduleTarget === null) return;
    moduleData.update(
      moduleTarget,
      context ?? createBlockContext({}),
      prevContext ?? createBlockContext({})
    )
  }

  attachModuleTarget () {
    const { state, $moduleWrapper } = this
    const { moduleTarget } = state
    if ($moduleWrapper === null) return;
    if (moduleTarget === null) return;
    $moduleWrapper.replaceChildren(moduleTarget)
  }

  render () {
    const { props, state } = this
    const { type, content } = props
    const { moduleLoading, moduleLoadErrors, moduleTarget } = state
    switch (type) {
      case 'html':
      case undefined:
        return content !== undefined
          ? <div dangerouslySetInnerHTML={{ __html: content }} />
          : null
      case 'module':
        if (moduleLoading) return <div>Loading...</div>
        else if (moduleLoadErrors !== null) return <div>
          <strong>Module load errors:</strong>
          <p>{moduleLoadErrors.name}</p>
          <p>{moduleLoadErrors.message}</p>
          <pre>{moduleLoadErrors.stack}</pre>
        </div>
        else if (moduleTarget !== null) return <div ref={n => { this.$moduleWrapper = n }} />
        else return null
      default:
        return <div>Block type {type} is unknown</div>
    }
  }
}
