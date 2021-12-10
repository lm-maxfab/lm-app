import { VNode } from 'preact'

export interface MyNavigator extends Navigator {
  connection: NetworkInformation
  mozConnection?: NetworkInformation
  webkitConnection?: NetworkInformation
}

export interface SheetbaseCollectionData {
  id: string
}

export interface IntroElementData extends SheetbaseCollectionData {
  image_url?: string
  title?: VNode
  paragraph?: VNode
}

export interface ChapterData extends SheetbaseCollectionData {
  label?: VNode
  teasing_label?: VNode
  teasing?: boolean
  title?: VNode
  kicker?: VNode
  image_url?: string
  article_url?: string
}

export interface CreditsContentData extends SheetbaseCollectionData {
  content?: VNode
}
