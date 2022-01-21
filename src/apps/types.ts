import { VNode } from 'preact'

export interface MyNavigator extends Navigator {
  connection: NetworkInformation
  mozConnection?: NetworkInformation
  webkitConnection?: NetworkInformation
}

export interface SheetbaseCollectionData {
  id: string
}

export interface HomeData extends SheetbaseCollectionData {
  bg_image_url?: string
  bg_size?: string
  bg_position?: string
  bg_opacity?: number
  title?: VNode
  kicker?: VNode
  intro?: VNode
}

export interface ChapterData extends SheetbaseCollectionData {
  title?: VNode
  kicker?: VNode
}

export interface ImageBlockData extends SheetbaseCollectionData {
  layout?: 'text-on-left'|'text-under'
  size?: string
  image_url?: string
  bg_color?: string
  legend_content?: VNode
  credits_content?: VNode
  read_also_content?: VNode
  read_also_url?: string
  chapter_number?: number
  row_number?: number
  position_in_row?: number
}

export interface ConsolidatedChapterData extends ChapterData {
  rows?: ImageBlockData[][]
}
