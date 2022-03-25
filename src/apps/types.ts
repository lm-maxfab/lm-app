import { VNode } from 'preact'

export interface MyNavigator extends Navigator {
  connection: NetworkInformation
  mozConnection?: NetworkInformation
  webkitConnection?: NetworkInformation
}

export interface SheetbaseCollectionData {
  id: string
} 

export interface HeadData extends SheetbaseCollectionData {
  overhead?: VNode|string
  title?: VNode|string
  background_image_url?: string
}

export interface IntroData extends SheetbaseCollectionData {
  paragraph?: VNode|string
  background_image_url?: string
}

export interface ChapterData extends SheetbaseCollectionData {
  paragraph?: VNode|string
  read_also_incentive?: VNode|string
  read_also_text?: VNode|string
  read_also_url?: string
  background_image_url?: string
}

export interface SummaryData extends SheetbaseCollectionData {
  title?: VNode|string
  link_1_text?: VNode|string
  link_1_url?: string
  link_2_text?: VNode|string
  link_2_url?: string
  link_3_text?: VNode|string
  link_3_url?: string
  link_4_text?: VNode|string
  link_4_url?: string
  link_5_text?: VNode|string
  link_5_url?: string
  background_image_url?: string
}

export interface FurtherReadingData extends SheetbaseCollectionData {
  title?: VNode|string
  paragraph?: VNode|string
  background_image_url?: string
}

export interface CreditsData extends SheetbaseCollectionData {
  content?: VNode|string
  background_image_url?: string
}
