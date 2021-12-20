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
  image_ratio?: string
  month?: MonthData
  description?: StrToHtml
  credits?: StrToHtml
}

export interface MonthData {
  id: string
  name?: string
}

export interface CreditsContentData {
  id: string
  content?: VNode
}
