import { VNode } from 'preact'

export interface SheetBaseCollectionData {
  id: string
}

export interface SideNoteData {
  bg_color?: string
  title?: VNode|string
  content?: VNode|string
}

export interface FooterContentData {
  marqueur_url?: string
  paragraph?: VNode|string
}

export interface ArticlesData {
  episode_number?: string
  title?: VNode|string
  published?: boolean
  url?: string
  bg_image_url?: string
  bg_video_url?: string
  displayed_publication_date?: string
}
