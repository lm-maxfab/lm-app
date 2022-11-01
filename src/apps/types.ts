import { VNode } from 'preact'

export interface SheetBaseCollectionData {
  id: string
}

export interface TeamData extends SheetBaseCollectionData {
  iso?: string
  country?: string
  surname?: string
  group?: string
  player?: string
  background?: string
}