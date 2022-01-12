export interface Log {
  message: any[]
  stack: string[]|undefined
  time: Date
}

class SilentLog {
  logRegister: Log[] = []

  log (...messages: any[]): void {
    const origin = window.location.origin
    const stack = new Error().stack
      ?.split('\n')
      .map(line => line.replace(origin, '').trim())
      .slice(2)
    const time = new Date()
    const log: Log = { message: messages, stack, time }
    this.logRegister.push(log)
  }

  get (): Log[] {
    return [...this.logRegister.map(log => ({ ...log }))]
  }

  print (slice: number = 100): void {
    const logs = this.get().slice(-1 * slice)
    logs.forEach(log => {
      console.log(
        `${log.time}`,
        `\n\n${log.stack?.join('\n')}\n\n`,
        ...log.message
      )
    })
  }
}

export default SilentLog
