interface ExtendedNavigator extends Navigator {
  mozConnection?: NetworkInformation
  webkitConnection?: NetworkInformation
}

interface ExtendedConnection extends NetworkInformation {
  downlink?: number
}

export type {
  ExtendedNavigator,
  ExtendedConnection
}

export default function getCurrentDownlink (): number|undefined {
  const navigator = window.navigator as ExtendedNavigator|undefined
  const connection = (
    navigator?.connection
    ?? navigator?.mozConnection
    ?? navigator?.webkitConnection
  ) as ExtendedConnection|undefined
  return connection?.downlink
}
