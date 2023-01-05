import { Component } from 'preact'
import styles from './styles.module.scss'

type LayoutName = 'left-half'|'right-half'
type TransitionName = 'whirl'|'grow'
type TransitionDescriptor = [TransitionName]|[TransitionName, number|string]

type PropsBlockData = {
  id?: string
  depth?: 'scroll'|'back'|'front'
  zIndex?: number
  type?: 'html'|'module'
  content?: string
  layout?: LayoutName
  mobileLayout?: LayoutName
  transitions: [['whirl', 600]]
  mobileTransitions: [['grow', 600]]
}

type PropsPageData = {
  bgColor?: JSX.CSSProperties['backgroundColor']
  blocks?: PropsBlockData[]
}

type Props = {
  thresholdOffset?: string
  bgColorTransitionDuration?: string|number
  pages?: PropsPageData[]
}



/* Actual Component */
export default class Scrollgneugneu extends Component<Props, State> {
  /* * * * * * * * * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * * * * * * * * */
  render () {
    return <div>I am the new scrllgngn</div>
  }
}
