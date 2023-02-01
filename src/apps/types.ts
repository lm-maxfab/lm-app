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
  show_header?: boolean
  show_nav?: boolean
  header_logo_fill_1?: string
  header_logo_fill_2?: string
  chapter_name?: string
  bg_color?: string
  content?: string
  layout?: string
  mobileLayout?: string
  blocks_ids?: string
}
