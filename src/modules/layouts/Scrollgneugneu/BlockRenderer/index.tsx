import { Component } from 'preact'
import { BlockContext, createBlockContext, contextsAreEqual } from '..'

type ModuleData = {
  init: (props: BlockContext) => HTMLElement|Promise<HTMLElement>
  update: (wrapper: HTMLElement, context: BlockContext, prevContext: BlockContext) => void
  styles?: string[]
}

type Props = {
  type?: 'module'|'html'
  content?: string
  context?: BlockContext
  prevContext?: BlockContext
  cssLoader?: (url: string) => Promise<void>
  devMode?: boolean
}

type State = {
  moduleLoading: boolean
  moduleLoadErrors: Error|null
  moduleData: ModuleData|null
  moduleIniting: boolean
  moduleTarget: HTMLElement|null
}

type StateSetter = ((s: State) => (State|null))|Partial<State>

export default class BlockRenderer extends Component<Props, State> {
  $moduleWrapper: HTMLDivElement|null = null
  state: State = {
    moduleLoading: false,
    moduleLoadErrors: null,
    moduleData: null,
    moduleIniting: false,
    moduleTarget: null
  }

  constructor (props: Props) {
    super(props)
    this.aSetState = this.aSetState.bind(this)
    this.loadModule = this.loadModule.bind(this)
    this.initModule = this.initModule.bind(this)
    this.updateModule = this.updateModule.bind(this)
    this.attachModuleTarget = this.attachModuleTarget.bind(this)
    this.detachModuleTarget = this.detachModuleTarget.bind(this)
    this.loadInitAttachModule = this.loadInitAttachModule.bind(this)
    this.updateAttachModule = this.updateAttachModule.bind(this)
  }

  componentDidMount (): void {
    const { props, loadInitAttachModule } = this
    const { type } = props
    if (type === 'module') loadInitAttachModule()
  }

  componentDidUpdate (pProps: Readonly<Props>): void {
    const {
      props,
      detachModuleTarget,
      loadInitAttachModule,
      updateAttachModule
    } = this
    const { type, content } = props
    if (type !== 'module') return detachModuleTarget()
    const { type: pType, content: pContent } = pProps
    if (type !== pType || content !== pContent) loadInitAttachModule()
    else {
      const newContext = props.context ?? createBlockContext({})
      const newPrevContext = props.prevContext ?? createBlockContext({})
      const oldContext = pProps.context ?? createBlockContext({})
      const oldPrevContext = pProps.prevContext ?? createBlockContext({})
      if (!contextsAreEqual(newContext, oldContext)
        || !contextsAreEqual(newPrevContext, oldPrevContext)
      ) updateAttachModule()
    }
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
    await this.aSetState(curr => ({
      ...curr,
      moduleLoading: true
    }))
    const moduleUrl = content
    try {
      const importedData = (await import(/* @vite-ignore */moduleUrl)) as unknown
      const importedIsNotObject = typeof importedData !== 'object'
      const importedIsNullish = importedData === null || importedData === undefined
      if (importedIsNotObject || importedIsNullish) throw new Error('Imported module is not an object')
      const importedDataAsAny = importedData as any
      const importedHasInitFunc = 'init' in importedData && typeof importedDataAsAny.init === 'function'
      const importedHasUpdateFunc = 'update' in importedData && typeof importedDataAsAny.update === 'function'
      const importedHasStyles = 'styles' in importedData
        && Array.isArray(importedDataAsAny.styles)
        && (importedDataAsAny?.styles as unknown[]|undefined)?.every(url => typeof url === 'string')
      if (!importedHasInitFunc) throw new Error('Imported module must export a function named init')
      if (!importedHasUpdateFunc) throw new Error('Imported module must export a function named update')
      const moduleData = importedData as ModuleData
      if (cssLoader !== undefined && importedHasStyles) {
        const styles = (importedDataAsAny.styles as string[])
        styles.forEach(url => cssLoader(url))
      }
      await this.aSetState(curr => ({
        ...curr,
        moduleLoading: false,
        moduleLoadErrors: null,
        moduleData
      }))
    } catch (err: unknown) {
      console.error(`Loading error - ${props.content}`)
      console.error(err)
      let moduleLoadErrors: Error = new Error('Unknown error')
      if (err instanceof Error) moduleLoadErrors = err
      else if (typeof err === 'string') moduleLoadErrors = new Error(err)
      await this.aSetState(curr => ({
        ...curr,
        moduleLoading: false,
        moduleLoadErrors
      }))
    } 
  }

  async initModule () {
    const { props, state, aSetState } = this
    const { context } = props
    const { moduleData } = state
    if (moduleData === null) return;
    await aSetState(curr => ({
      ...curr,
      moduleIniting: true
    }))
    const moduleTarget = await moduleData.init(context ?? createBlockContext({})) as unknown
    const targetIsHTMLElement = moduleTarget instanceof HTMLElement
    if (!targetIsHTMLElement) {
      const errorStr = 'Imported module init exported function should return a HTMLElement object'
      console.error(`Init error - ${props.content}`)
      console.error(errorStr)
      return await this.aSetState(curr => ({
        ...curr,
        moduleLoadErrors: new Error(errorStr),
        moduleIniting: false
      }))
    }
    return await this.aSetState(curr => ({
      ...curr,
      moduleLoadErrors: null,
      moduleIniting: false,
      moduleTarget
    }))
  }

  async updateModule () {
    const { props, state } = this
    const { context, prevContext } = props
    const { moduleData, moduleTarget } = state
    if (moduleData === null || moduleTarget === null) return;
    console.log('update:', props.content)
    console.log(context)
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
    const wrapperChildren = [...$moduleWrapper.children]
    const targetIsInWrapper = wrapperChildren.includes(moduleTarget)
    if (!targetIsInWrapper) $moduleWrapper.replaceChildren(moduleTarget)
  }

  detachModuleTarget () {
    const { $moduleWrapper } = this
    if ($moduleWrapper === null) return;
    $moduleWrapper.replaceChildren()
  }

  async loadInitAttachModule () {
    await this.loadModule()
    await this.initModule()
    this.attachModuleTarget()
  }

  async updateAttachModule () {
    await this.updateModule()
    this.attachModuleTarget()
  }

  render () {
    const { props, state } = this
    const { type, content, devMode } = props
    const { moduleLoading, moduleLoadErrors, moduleIniting, moduleTarget } = state
    switch (type) {
      case 'html':
      case undefined:
        return content !== undefined
          ? <div dangerouslySetInnerHTML={{ __html: content }} />
          : null
      case 'module':
        // Loading
        if (moduleLoading && devMode) return <div>Loading...</div>
        else if (moduleLoading) return null
        // Load errors
        if (moduleLoadErrors !== null && devMode) return <div>
          <strong>Module load or init errors:</strong>
          <p>{moduleLoadErrors.name}</p>
          <p>{moduleLoadErrors.message}</p>
          <pre>{moduleLoadErrors.stack}</pre>
        </div>
        else if (moduleLoadErrors) return null
        // Init
        if (moduleIniting && devMode) return <div>Init...</div>
        else if (moduleIniting) return null
        // Render
        if (moduleTarget !== null) return <div ref={n => { this.$moduleWrapper = n }} />
        else return null
      default:
        return <div>Block type {type} is unknown</div>
    }
  }
}
