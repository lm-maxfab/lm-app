/* * * * * * * * * * * * * * * * * * * * * * *
 *
 * TYPES
 * 
 * * * * * * * * * * * * * * * * * * * * * * */

type AmplitudeSdk = {
  logEvent: (
    eventName: string,
    payload?: { [key: string]: any }
  ) => void
}
type AtInternetPayload = {
  name: string
  type: string
  level2: number
  chapter1: string
  chapter2: string
  chapter3: string
}
type AtInternetSdk = {
  Utils?: {}
  Tracker?: {
    instances?: Array<{
      click?: {
        send?: (payload: AtInternetPayload) => void
      }
    }>
  }
}

/* * * * * * * * * * * * * * * * * * * * * * *
 *
 * HELPERS
 * 
 * * * * * * * * * * * * * * * * * * * * * * */

function getAmplitudeSdk () {
  const amplitudeSdk = (window as any).amplitude as AmplitudeSdk|undefined
  return amplitudeSdk ?? null
}

function getAtInternetTrackerInstance () {
  const atInternet = (window as any).ATInternet as AtInternetSdk|undefined
  const tracker = atInternet?.Tracker
  const instances = tracker?.instances
  const instance = instances?.[0]
  return instance ?? null
}

const defaultAtInternetPayload: Omit<AtInternetPayload, 'name'> = {
  type: 'action',
  level2: 22,
  chapter1: '',
  chapter2: '',
  chapter3: ''
}

function makeAtInternetPayload (
  partialPayload: Partial<AtInternetPayload> & { name: string }
): AtInternetPayload {
  return {
    ...defaultAtInternetPayload,
    ...partialPayload
  }
}

/* * * * * * * * * * * * * * * * * * * * * * *
 *
 * LOGGERS
 * 
 * * * * * * * * * * * * * * * * * * * * * * */

export enum EventNames {
  SCROLL_STARTED,
  FOOTER_VISIBLE,
  FOOTER_ITEM_CLICK,
  SCRLLGNGN_HALF_REACHED,
  SCRLLGNGN_END_REACHED
}

function logToAmplitude (eventName: EventNames) {
  const amplitudeSdk = getAmplitudeSdk()
  if (amplitudeSdk === null) return
  const { logEvent } = amplitudeSdk
  switch (eventName) {
    case EventNames.SCROLL_STARTED: return logEvent('scroll: element autre', { scroll_position: 'any' })
    case EventNames.FOOTER_VISIBLE: return logEvent('bloc: nav footer visuel')
    case EventNames.FOOTER_ITEM_CLICK: return logEvent('clic: nav footer visuel')
    case EventNames.SCRLLGNGN_HALF_REACHED: return logEvent('bloc: longform half')
    case EventNames.SCRLLGNGN_END_REACHED: return logEvent('bloc: longform end')
  }
}

function logToAtInternet (eventName: EventNames) {
  const atInternetInstance = getAtInternetTrackerInstance()
  if (atInternetInstance === null) return
  const logClick = (partialPayload: Parameters<typeof makeAtInternetPayload>[0]) => {
    const payload = makeAtInternetPayload(partialPayload)
    atInternetInstance.click?.send?.(payload)
  }
  switch (eventName) {
    case EventNames.SCROLL_STARTED: return logClick({ name: 'scroll: element autre' })
    case EventNames.FOOTER_VISIBLE: return logClick({ name: 'bloc: nav footer visuel' })
    case EventNames.FOOTER_ITEM_CLICK: return logClick({ name: 'clic: nav footer visuel' })
    case EventNames.SCRLLGNGN_HALF_REACHED: return logClick({ name: 'bloc: longform half' })
    case EventNames.SCRLLGNGN_END_REACHED: return logClick({ name: 'bloc: longform end' })
  }
}

/* * * * * * * * * * * * * * * * * * * * * * *
 *
 * EXPORT
 * 
 * * * * * * * * * * * * * * * * * * * * * * */

export function logEvent (eventName: EventNames) {
  console.log('I log event', eventName)
  logToAmplitude(eventName)
  logToAtInternet(eventName)
}
