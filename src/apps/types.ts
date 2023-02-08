import { VNode } from 'preact'

export interface SheetBaseCollectionData {
  id: string
}

// [WIP] no snake_case please
export interface GeneralSettings extends SheetBaseCollectionData {
  threshold_offset?: string
  bg_color_transition_duration?: string
  lazyLoadDistance?: number
  viewportHeight?: string
  topOffset?: number
  headerCustomClass?: string
  headerCustomCss?: string
  headerNavItemsAlign?: string
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

// [WIP] no snake_case please
export interface PageData extends SheetBaseCollectionData {
  page_destination?: string
  show_header?: boolean
  show_nav?: boolean
  header_logo_fill_1?: string
  header_logo_fill_2?: string
  headerCustomClass?: string
  headerCustomCss?: string
  headerNavItemsAlign?: string
  chapter_name?: string
  isChapterHead?: boolean
  bg_color?: string
  content?: string
  layout?: string
  mobileLayout?: string
  blocks_ids?: string
}

export interface FooterData extends SheetBaseCollectionData {
  header?: VNode | string,
  styles?: string,
}

export interface EpisodeData extends SheetBaseCollectionData {
  text_top?: VNode | string,
  text_bottom?: VNode | string,
  text_card?: VNode | string,
  url?: string,
  cover?: string,
  published?: boolean,
}
