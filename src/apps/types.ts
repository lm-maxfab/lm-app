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
  target_article_id?: string
  title?: VNode|string
  kicker?: VNode|string
  published?: boolean
  url?: string
  bg_image_url?: string
  bg_video_url?: string
  bg_video_1080_url?: string
  bg_video_720_url?: string
  bg_video_540_url?: string
  bg_video_360_url?: string
  bg_video_240_url?: string
  displayed_publication_date?: string
}

export interface CreditsData extends SheetBaseCollectionData {
  content?: VNode|string
}
