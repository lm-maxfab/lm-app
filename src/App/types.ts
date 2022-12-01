import { VNode } from 'preact'
import StrToHtml from '../modules/le-monde/components/StrToHtml';

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
  image_format?: string
  image_ratio?: number
  description?: StrToHtml
  credits?: StrToHtml
  alt?: string
}

export interface MonthData {
  id: string
  name?: string
}

export interface CreditsContentData {
  id: string
  content?: VNode
}
