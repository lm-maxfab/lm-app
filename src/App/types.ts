import { JSX, VNode } from 'preact'

export interface FragmentSources {
  vimeo_video_desktop_1080_url: string
  vimeo_video_desktop_720_url: string
  vimeo_video_desktop_540_url: string
  vimeo_video_desktop_360_url: string
  vimeo_video_mobile_648_url: string
  vimeo_video_mobile_432_url: string
  decodeurs_video_desktop_url: string
  decodeurs_video_mobile_url: string
  video_poster_desktop_url: string
  video_poster_mobile_url: string
  wide_cover_desktop_hd_url: string
  wide_cover_desktop_sd_url: string
  wide_cover_desktop_center: string
  wide_cover_mobile_hd_url: string
  wide_cover_mobile_sd_url: string
  wide_cover_mobile_center: string
  grid_cover_hd_url: string
  grid_cover_sd_url: string
  grid_cover_center: string
  menu_thumb_hd_url: string
  menu_thumb_sd_url: string
}

export interface Fragment extends FragmentSources {
  id: string
  publish: boolean
  title: VNode
  supertitle: VNode
  subtitle: VNode
  kicker: VNode
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
  opacity: number
  h_position: string
  height: string
  width: string
  paragraph_chunk: JSX.Element
  related_fragment: Fragment
}

export interface HomeImage {
  id: string
  publish: boolean
  url: string
  center: string
  side: string
  animation_slot_desktop: number
  animation_slot_mobile: number
  opacity: number
  related_fragment: Fragment
}

export interface PageSettings {
  intro_first_paragraph_chunk: VNode
}
