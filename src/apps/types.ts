export interface SheetBaseCollectionData {
  id: string
}

export interface GeneralSettings extends SheetBaseCollectionData {
  thresholdOffset?: string
  bgColorTransitionDuration?: string
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

export interface PageData extends SheetBaseCollectionData {
  showHeader?: boolean
  showNav?: boolean
  headerLogoFill1?: string
  headerLogoFill2?: string
  headerCustomClass?: string
  headerCustomCss?: string
  headerNavItemsAlign?: string
  chapterName?: string
  isChapterHead?: boolean
  bgColor?: string
  content?: string
  layout?: string
  mobileLayout?: string
  blocksIds?: string
}
