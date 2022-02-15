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
  kicker?: VNode|string
  paragraph?: VNode|string
  title?: VNode|string
  images_opacity?: number
}

export interface IntroImageData extends SheetbaseCollectionData {
  url?: string
}

export interface CreditsData extends SheetbaseCollectionData {
  content?: VNode|string
}
