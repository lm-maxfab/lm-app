import { VNode } from 'preact'

export interface SheetBaseCollectionData {
  id: string
}

export interface GeneralData extends SheetBaseCollectionData {
  title?: VNode | string,
  chapo?: VNode | string,
  cta_text?: VNode | string,
  cta_url?: string,
}

export interface EpisodeData extends SheetBaseCollectionData {
  title?: VNode | string,
  url?: string,
  cover?: string,
  published?: boolean,
  date?: string,
}
