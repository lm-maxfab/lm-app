import { VNode } from 'preact'

export interface SheetBaseCollectionData {
  id: string
}

export interface GeneralData extends SheetBaseCollectionData {
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
