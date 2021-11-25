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

  image_1_url?: string
  image_1_alt?: string
  
  image_2_url?: string
  image_2_alt?: string
  
  image_3_url?: string
  image_3_alt?: string
  
  image_4_url?: string
  image_4_alt?: string
  
  month?: MonthData
  description?: VNode
  credits?: VNode
}

export interface MonthData {
  id: string
  name?: string
}

export interface CreditsContentData {
  id: string
  content?: VNode
}
