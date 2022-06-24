import { VNode } from 'preact'

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
  text_block_classes?: string
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

export interface FooterData extends SheetBaseCollectionData {
  title?: VNode|string
  paragraph?: VNode|string
  button_text?: VNode|string
  button_url?: string
  button_opens_new_tab?: boolean
}

export interface FooterThumbData extends SheetBaseCollectionData {
  bgImageUrl?: string
  title?: VNode|string
  articleUrl?: string
  openNewTab?: boolean
  filterColor?: string
  filterColorHover?: string
}
