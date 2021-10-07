import { JSX, VNode } from 'preact'

export interface FragmentSources {
  vimeo_video_desktop_url: string
  vimeo_video_mobile_url: string
  decodeurs_video_desktop_url: string
  decodeurs_video_mobile_url: string
  video_poster_desktop_url: string
  video_poster_mobile_url: string
  image_desktop_url: string
  image_mobile_url: string
  image_center: string
}

export interface Fragment extends FragmentSources {
  id: string
  publish: boolean
  title: VNode
  subtitle: VNode
  chapo: VNode
  head_image_url: string
  head_image_center: string
  head_video_url: string
  head_video_center: string
  region: string
  thematic: string
  display: string
  order: number
}

export interface IntroImage {
  id: string
  url: string
  h_position: string
  height: string
  width: string
  paragraph_chunk: JSX.Element
  related_fragment: Fragment
}

export interface HomeImage {
  id: string
  publish: boolean
  image_url: string
  image_center: string
  image_side: string
  image_animation_slot_desktop: number
  image_animation_slot_mobile: number
  related_fragment: Fragment
}

export interface PageSettings {
  intro_first_paragraph_chunk: VNode
}
