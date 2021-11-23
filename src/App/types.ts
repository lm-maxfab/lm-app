import { VNode } from 'preact'

export interface SlideData {
  id: string
  title?: VNode
  para_1?: VNode
  quote_1?: VNode
  para_2?: VNode
  quote_2?: VNode
  illus_url?: string
  reverse_layout?: boolean
}

export interface PageSettings {}
