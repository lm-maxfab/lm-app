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
  
  background_block_content?: VNode|string
  background_block_style_variants?: string
  text_block_content?: VNode
  text_block_margin_top?: string
  text_block_margin_bottom?: string
  text_block_position?: string
  text_block_text_align?: string
  text_block_style_variants?: string
}

export interface CreditsData extends SheetbaseCollectionData {
  content?: VNode
}

export interface StyleVariantsData extends SheetbaseCollectionData {
  variant_name?: string
  selector?: string
  max_width?: number
  inline_style?: string
}
