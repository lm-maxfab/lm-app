import { VNode } from 'preact'

export interface MyNavigator extends Navigator {
  connection: NetworkInformation
  mozConnection?: NetworkInformation
  webkitConnection?: NetworkInformation
}

interface IntroTextElement {
  id: string
  type?: 'texte'
  content?: VNode
}

interface IntroImageElement {
  id: string
  type: 'image'
  url?: string
}

export type IntroElement = IntroTextElement|IntroImageElement

export interface Destination {
  id: string
  title?: string
  supertitle?: string
  kicker?: string
  content?: VNode
  main_color?: string
  contrast_color?: string
  article_url?: string
  shape?: 'church'|'circles'|'oval'|'pill'
  main_photo_url?: string
  main_photo_url_alt?: string
}

export interface CreditsData {
  id: string
  content?: VNode
}

export interface GeneralSettingsData {
  id: string
  longform_url?: string
}
