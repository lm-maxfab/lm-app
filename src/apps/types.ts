import { VNode } from 'preact'

export interface MyNavigator extends Navigator {
  connection: NetworkInformation
  mozConnection?: NetworkInformation
  webkitConnection?: NetworkInformation
}

export interface SheetBaseCollectionData {
  id: string
}

export interface PageData extends SheetBaseCollectionData {
  background_block_color?: string
  background_block_content?: VNode|string
  text_block_content?: VNode
  text_block_margin_top?: string
  text_block_margin_bottom?: string
  text_block_position?: string
  text_block_text_align?: string
}

export interface CreditsData extends SheetBaseCollectionData {
  content?: VNode
}

export interface SettingsData extends SheetBaseCollectionData {
  scrollator_threshold_offset: string
}

export interface CustomCssData extends SheetBaseCollectionData {
  css?: string
}
