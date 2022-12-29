/**
 * Returns a throttled version of the function passed as an argument
 * @param toThrottleFunc - The function that has to be throttled
 * @param delayMs - The throttle delay in ms
 */
export function throttle (toThrottleFunc: Function, delayMs: number) {
  let timeout: number|undefined = undefined
  let lastArgs: any[] = []
  return function throttled (...args: any[]) {
    lastArgs = args
    if (typeof timeout === 'number') return
    timeout = window.setTimeout(() => {
      toThrottleFunc(...lastArgs)
      timeout = undefined
    }, delayMs)
  }
}

/**
 * Returns a debounced version of the function passed as an argument
 * @param toDebounceFunc - The function that has to be debounced
 * @param delayMs - The debounce delay in ms
 */
export function debounce (toDebounceFunc: Function, delayMs: number) {
  let timeout: number|undefined = undefined
  let lastArgs: any[] = []
  return function debounced (...args: any[]) {
    lastArgs = args
    window.clearTimeout(timeout)
    timeout = window.setTimeout(() => {
      toDebounceFunc(...lastArgs)
    }, delayMs)
  }
}
