export interface MyNavigator extends Navigator {
  connection: NetworkInformation
  mozConnection?: NetworkInformation
  webkitConnection?: NetworkInformation
}

export interface PageSettings {}
