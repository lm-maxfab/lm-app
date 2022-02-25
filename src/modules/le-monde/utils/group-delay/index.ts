type DelayProp = number
type FunctonProp = (...params: any[]) => void
type DelayParam = DelayProp
type FunctionParam = FunctonProp

class GroupDelay {
  delay: DelayProp
  fn: FunctonProp
  lastExecTime: number = -Infinity
  execTimeout: number|null = null

  constructor (fn: FunctionParam, delay: DelayParam) {
    this.delay = delay
    this.fn = fn
    this.call = this.call.bind(this)
    this.execute = this.execute.bind(this)
  }

  get delayTillNextExecution () {
    return this.lastExecTime + this.delay - Date.now()
  }

  call () {
    const hasNewCallPlanned = this.execTimeout !== null
    if (hasNewCallPlanned) return
    const delayTillNext = this.delayTillNextExecution
    const lastCallIsStale = delayTillNext <= 0
    if (lastCallIsStale) return this.execute()
    else { this.execTimeout = window.setTimeout(this.execute, delayTillNext) }
  }

  execute () {
    this.lastExecTime = Date.now()
    if (this.execTimeout !== null) {
      window.clearTimeout(this.execTimeout)
      this.execTimeout = null
    }
    return this.fn()
  }
}

const groupDelay = (fn: FunctionParam, delay: DelayParam) => new GroupDelay(fn, delay).call

export { groupDelay }
export default GroupDelay
