import { VNode } from "preact";

export interface MyNavigator extends Navigator {
  connection: NetworkInformation
  mozConnection?: NetworkInformation
  webkitConnection?: NetworkInformation
}

export interface SheetbaseCollectionData {
  id: string
}

export interface PageData extends SheetbaseCollectionData {
  mobile_image_url?: string
  desktop_image_url?: string
  text_block_content?: VNode
  padding_top?: string
  padding_bottom?: string
  position?: string
  text_align?: string
}
