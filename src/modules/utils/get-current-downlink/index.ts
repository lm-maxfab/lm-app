interface NetworkInformation {}

interface ExtendedConnection extends NetworkInformation {
  downlink?: number
}

interface ExtendedNavigator extends Navigator {
  connection?: ExtendedConnection
  mozConnection?: ExtendedConnection
  webkitConnection?: ExtendedConnection
}

export type {
  ExtendedNavigator,
  ExtendedConnection
}

export default function getCurrentDownlink (): number|undefined {
  const navigator = window.navigator as ExtendedNavigator|undefined
  const connection = (navigator?.connection ?? navigator?.mozConnection ?? navigator?.webkitConnection) as ExtendedConnection|undefined
  const downlink = connection?.downlink
  return downlink
}