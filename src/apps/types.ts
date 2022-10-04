import { VNode } from 'preact'
import { SheetBaseCollectionData } from '../sheet-base-entries'

export interface IntroPageData extends SheetBaseCollectionData {
  heading?: VNode|string
  kicker?: VNode|string
  paragraph?: VNode|string
}

export interface ChapterData extends SheetBaseCollectionData {
  desktop_illustration_url?: string
  mobile_illustration_url?: string
  title?: VNode|string
  paragraph?: VNode|string
  links_ids?: string
}

export interface LinkData extends SheetBaseCollectionData {
  title?: VNode|string
  kicker?: VNode|string
  url?: string
  pre_publication_label?: VNode|string
  is_published?: boolean
  is_primary?: boolean
}

export interface ChapterDataWithLinks extends ChapterData {
  links?: LinkData[]
}

export interface CreditsData extends SheetBaseCollectionData {
  content?: VNode|string
}

export interface SideNoteData extends SheetBaseCollectionData {
  title?: VNode|string
  paragraph?: VNode|string
  link_url?: string
}
