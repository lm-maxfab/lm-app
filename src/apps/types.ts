import { VNode } from 'preact'

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
  image_or_video_legend?: VNode|string
  image_or_video_credits?: VNode|string
  video_poster_url?: string
  verbatim_author?: VNode|string
  verbatim_author_role?: VNode|string
  content?: VNode|string
}
