import { VNode } from 'preact'
import { SheetBaseCollection } from '../modules/le-monde/utils/sheet-base'

export interface MyNavigator extends Navigator {
  connection: NetworkInformation
  mozConnection?: NetworkInformation
  webkitConnection?: NetworkInformation
}

export interface SheetbaseCollectionData {
  id: string
}

export interface IntroData extends SheetbaseCollectionData {
  paragraph?: VNode
  title?: VNode
}

export interface IntroImageData extends SheetbaseCollectionData {
  url?: string
}
