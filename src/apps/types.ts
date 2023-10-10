import { VNode } from 'preact'

<<<<<<< HEAD
export interface SheetbaseCollectionData {
  id: string
}

export interface HomeData extends SheetbaseCollectionData {
  bg_image_url?: string
  bg_image_mobile_url?: string
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
  main_color?: string
=======
export interface SheetBaseCollectionData {
  id: string
}

export interface GeneralData extends SheetBaseCollectionData {
  title?: VNode | string,
  intro?: string,
  sidenote?: string
  conclusion?: VNode | string,
  groupTitle?: string,
  cardCTA?: string,
  headerTitle?: string,
  credits?: VNode | string,
  markerURL?: string,
  infoText?: VNode | string,
>>>>>>> 1caabc4f63ba4f5f8f08c558dab0e941d71365da
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