import { VNode } from 'preact'

export interface SheetBaseCollectionData {
  id: string
}

export interface GeneralSettings extends SheetBaseCollectionData {
  threshold_offset?: string
  bg_color_transition_duration?: string
}

export interface BlockData extends SheetBaseCollectionData {
  depth?: string
  type?: string
  content?: string
  layout?: string
  mobileLayout?: string
  transitions?: string
  mobileTransitions?: string
  zIndex?: number
  trackScroll?: boolean
}

export interface PageData extends SheetBaseCollectionData {
  bg_color?: string
  content?: string
  layout?: string
  mobileLayout?: string
  blocks_ids?: string
}

export interface FooterData extends SheetBaseCollectionData {
  top_content?: VNode|string
  styles?: string
}

export interface EpisodeData extends SheetBaseCollectionData {
  text_top?: VNode|string
  text_bottom?: VNode|string
  text_card?: VNode|string
  url?: string
  cover?: string
  published?: boolean
}
