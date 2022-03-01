export interface Log {
  message: any[]
  stack: string[]|undefined
  time: Date
}

export interface PrintOptions {
  verbose?: boolean
}

export const defaultPrintOptions: PrintOptions = {
  verbose: true
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

  print (
    slice: number = 100,
    options: PrintOptions = defaultPrintOptions
  ): void {
    const logs = this.get().slice(-1 * slice)
    logs.forEach(log => {
      const time = log.time
      let timeStr = new Date(time).toLocaleDateString(navigator.language, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      }) + `:${time.getMilliseconds()}`
      if (options.verbose) console.log(`🪵 ${timeStr}\n\n${log.stack?.join('\n')}\n\n`, ...log.message)
      else console.log(...log.message)
    })
  }
}

export default SilentLog
