import { VNode } from 'preact'

export interface HomeImageData {
  id: string
  url?: string
}

export interface IntroParagraphData {
  id: string
  content?: VNode
}

export interface ImageBlockData {
  id: string
  image_url?: string
  image_ratio?: string
  month?: MonthData
  description?: string
  credits?: string
}

export interface MonthData {
  id: string
  name?: string
}

export interface CreditsContentData {
  id: string
  content?: VNode
}
