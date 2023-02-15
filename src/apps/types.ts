export interface SheetBaseEntryData {
  id: string
}

// [WIP] no snake_case please
export interface GeneralSettings extends SheetBaseEntryData {
  threshold_offset?: string
  bg_color_transition_duration?: string
  lazyLoadDistance?: number
  viewportHeight?: string
  topOffset?: number
  headerCustomClass?: string
  headerCustomCss?: string
  headerNavItemsAlign?: string
}

export interface VideoData extends SheetBaseEntryData {
  destination?: string
  source?: string
  sourceType?: string
  posterUrl?: string
  title?: string
  kicker?: string
  description?: string
  credits?: string
  alt?: string
  loop?: boolean
  autoplay?: boolean
  sound?: boolean
  soundControls?: boolean
  playControls?: boolean
  timeControls?: boolean
  preload?: boolean
  disclaimer?: boolean
  disclaimerText?: string
  disclaimerButton?: string
  height?: string
}

export interface BlockData extends SheetBaseEntryData {
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
export interface PageData extends SheetBaseEntryData {
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
