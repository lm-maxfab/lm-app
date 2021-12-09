import { VNode } from 'preact'

export interface MyNavigator extends Navigator {
  connection: NetworkInformation
  mozConnection?: NetworkInformation
  webkitConnection?: NetworkInformation
}

export interface ChapterData {
  id: string
  number?: number
  title?: VNode
  kicker?: VNode
  imageUrl?: string
  articleUrl?: string
}
