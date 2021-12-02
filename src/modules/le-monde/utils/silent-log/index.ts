export interface Log {
  message: any[]
  stack: string[]|undefined
  time: Date
}

const logRegister: Log[] = []

export function printRegister (slice: number = 0, short: boolean = false): void {
  const register = getRegister(slice)
  if (short) {
    register.forEach(log => {
      const time = log.time
      const message = log.message
      console.log(time.getTime(), message)
    })
  } else {
    register.forEach(log => {
      const time = log.time
      const stack = log.stack?.join('\n')
      const message = log.message
      console.log(time, '\n\n', stack, '\n\n', message, '\n')
    })
  }
}

export function getRegister (slice: number = 0): Log[] {
  return [...logRegister].slice(slice)
}

export default function silentLog (...messages: any[]): Log[] {
  const origin = window.location.origin
  const stack = new Error().stack
    ?.split('\n')
    .map(line => line.replace(origin, '').trim())
    .slice(2)
  const time = new Date()
  const log: Log = { message: messages, stack, time }
  logRegister.push(log)
  return getRegister()
}
