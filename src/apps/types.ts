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
  destination_slot?: string
  background_block_color?: string
  background_block_content?: VNode|string
  text_block_content?: VNode
  text_block_margin_top?: string
  text_block_margin_bottom?: string
  text_block_position?: string
  text_block_text_align?: string
  text_block_style_variants?: string
}

export interface CreditsData extends SheetBaseCollectionData {
  content?: VNode
}

export interface StyleVariantsData extends SheetBaseCollectionData {
  variant_name?: string
  selector?: string
  max_width?: number
  inline_style?: string
}

export interface SettingsData extends SheetBaseCollectionData {
  scrollator_threshold_offset: string
}

export interface ArticleBlockData extends SheetBaseCollectionData {
  type?: string
  image_or_video_url?: string
  title?: VNode|string
  content?: VNode|string
  contrast_color?: string
  text_color?: string
  border_color?: string
  bg_color?: string
}
