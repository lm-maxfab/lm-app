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
  url: string
  publish: boolean
  title: VNode
  supertitle: VNode
  subtitle: VNode
  kicker: VNode
  head_image_url: string
  head_image_center: string
  head_video_url: string
  head_video_center: string
  related_regions_ids: string
  related_thematics_ids: string
  display: string
  order: number
}

export interface ShortFragmentWithBetterRels {
  id: string
  order: number
  kicker: VNode
  supertitle: VNode
  subtitle: VNode
  title: VNode
  url: string
  menu_thumb_hd_url: string
  menu_thumb_sd_url: string
  related_regions_ids_arr: string[]
  related_thematics_ids_arr: string[]
  main_region: Region|undefined
  main_thematic: Thematic|undefined
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
  url: string
  center: string
  side: string
  animation_slot_desktop: number
  animation_slot_mobile: number
  opacity: number
  related_fragment: Fragment
}

export interface Region {
  id: string
  full_name: string
  order: number
}

export interface Thematic {
  id: string
  name: string
  order: number
}

export interface PageSettings {
  intro_first_paragraph_chunk: VNode
  about_title: VNode
  about_content: VNode
  about_background_image_desktop_url: string
  about_background_image_mobile_url: string
  about_background_image_desktop_center: string
  about_background_image_mobile_center: string
  about_france_map_url: string
  filters_incentive: VNode
}
