import { VNode } from 'preact'

export interface SheetBaseCollectionData {
  id: string
}

export interface GeneralData extends SheetBaseCollectionData {
  title?: VNode | string,
  intro?: string,
  sidenote?: string
  conclusion?: VNode | string,
  credits?: VNode | string,
}

export interface FooterData extends SheetBaseCollectionData {
  title?: string,
  cta?: string,
  url?: string,
}

export interface TeamData extends SheetBaseCollectionData {
  iso?: string,
  country?: string,
  group?: string,
  url?: string,
}