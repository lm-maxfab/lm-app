import { Component } from 'preact'

export type BlockContext = {
  width?: number|undefined
  height?: number|undefined
}

type ModuleData = {
  init: (props: BlockContext) => HTMLElement
  update: (wrapper: HTMLElement, props: BlockContext) => HTMLElement
}

type Props = {
  type?: 'module'|'html'
  content?: string
  context?: BlockContext
}

type State = {
  moduleLoading: boolean
  moduleErrors: any
  moduleData: ModuleData|null
}

type StateSetter = ((s: State) => State|null)|Partial<State>

export default class BlockRenderer extends Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.aSetState = this.aSetState.bind(this)
    this.loadModule = this.loadModule.bind(this)
    this.initModule = this.initModule.bind(this)
    this.loadInitModule = this.loadInitModule.bind(this)
    this.updateModule = this.updateModule.bind(this)
  }

  componentDidMount () {
    const { type, content } = this.props
    if (type !== 'module' || content === undefined) return
    this.loadInitModule ()
  }

  async aSetState (stateSetter: StateSetter) {
    return new Promise(resolve => {
      this.setState(
        stateSetter,
        () => resolve(true)
      )
    })
  }

  async loadModule () {
    await this.aSetState(curr => ({
      ...curr,
      moduleLoading: true,
      moduleErrors: null,
      moduleData: null
    }))
  }

  async initModule () {
    
  }

  async loadInitModule () {

  }

  async updateModule () {
    
  }

  render () {
    const { props } = this
    const content = props.content ?? ''
    console.log('BLKRDR - RENDER', props.context)

    switch (props.type) {
      case 'html':
      case undefined:
        return <div dangerouslySetInnerHTML={{ __html: content }} />
      case 'module':
        return <div>
          I am module
        </div>
      default:
        return <div>Block type {props.type} is unknown</div>
    }
  }
}
