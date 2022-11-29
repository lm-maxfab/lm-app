import { VNode } from 'preact'

export interface SlideData {
  id: string
  label?: VNode
  title?: string
  title_bottom?: string
  para_1?: VNode
  para_2?: VNode
  illus_url?: string
  illus_alt?: string
  illus_background?: boolean
  illus_bottom?: boolean
}

export interface IntroSlideData {
  id: string
  date?: string
  title?: VNode
  credits?: VNode
  intro?: VNode
  illus_cover?: string
  cta?: string
}

export interface PageSettings {}
