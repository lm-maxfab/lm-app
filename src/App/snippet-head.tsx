import { Component, JSX } from 'preact'
import clss from 'classnames'
import { SheetBase } from '../modules/sheet-base'
import './snippet-head.css'
import Header from './components/Header'
import WideFragmentIcono from './components/WideFragmentIcono'
import Parallax from '../modules/le-monde/components/Parallax'
import { Fragment as FragmentInterface, FragmentSources } from './types'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  sheetBase?: SheetBase
  currentFragmentId?: string
}

class App extends Component<Props, {}> {
  mainClass: string = 'lm-app-fragments-snippet-head'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    // Logic
    const sheetBase = props.sheetBase ?? new SheetBase()
    const fragments = sheetBase.collection('fragments').value as unknown as FragmentInterface[]
    const currentFragment = fragments.find(fragment => fragment.id === props.currentFragmentId)
    const sources: FragmentSources = {
      vimeo_video_desktop_1080_url: currentFragment?.vimeo_video_desktop_1080_url ?? '',
      vimeo_video_desktop_720_url: currentFragment?.vimeo_video_desktop_720_url ?? '',
      vimeo_video_desktop_540_url: currentFragment?.vimeo_video_desktop_540_url ?? '',
      vimeo_video_desktop_360_url: currentFragment?.vimeo_video_desktop_360_url ?? '',
      vimeo_video_mobile_648_url: currentFragment?.vimeo_video_mobile_648_url ?? '',
      vimeo_video_mobile_432_url: currentFragment?.vimeo_video_mobile_432_url ?? '',
      decodeurs_video_desktop_url: currentFragment?.decodeurs_video_desktop_url ?? '',
      decodeurs_video_mobile_url: currentFragment?.decodeurs_video_mobile_url ?? '',
      video_poster_desktop_url: currentFragment?.video_poster_desktop_url ?? '',
      video_poster_mobile_url: currentFragment?.video_poster_mobile_url ?? '',
      wide_cover_desktop_hd_url: currentFragment?.wide_cover_desktop_hd_url ?? '',
      wide_cover_desktop_sd_url: currentFragment?.wide_cover_desktop_sd_url ?? '',
      wide_cover_desktop_center: currentFragment?.wide_cover_desktop_center ?? '',
      wide_cover_mobile_hd_url: currentFragment?.wide_cover_mobile_hd_url ?? '',
      wide_cover_mobile_sd_url: currentFragment?.wide_cover_mobile_sd_url ?? '',
      wide_cover_mobile_center: currentFragment?.wide_cover_mobile_center ?? '',
      grid_cover_hd_url: currentFragment?.grid_cover_hd_url ?? '',
      grid_cover_sd_url: currentFragment?.grid_cover_sd_url ?? '',
      grid_cover_center: currentFragment?.grid_cover_center ?? '',
      menu_thumb_hd_url: currentFragment?.menu_thumb_hd_url ?? '',
      menu_thumb_sd_url: currentFragment?.menu_thumb_sd_url ?? ''
    }

    // Classes
    const classes: string = clss(this.mainClass, props.className)
    const inlineStyle = { ...props.style }

    // Display
    return (
      <div className={classes} style={inlineStyle}>
        <Parallax render={(p) => {
          const scrolled = Math.min(Math.max(Number.isNaN(p) ? 0 : p, 0), 1)
          const top = scrolled
          console.log(top)
          const headerWrapperStyle: JSX.CSSProperties = {
            backgroundColor: `rgb(0, 0, 0, ${scrolled})`,
            borderBottom: `1px rgb(255, 255, 255, ${.3 * (1 - scrolled)}) solid`
          }
          const textsStyle: JSX.CSSProperties = {
            // top: `${scrolled * 25}%`,
            top: `0%`,
            opacity: 1 - scrolled
          }
          return <>
            <div
              style={headerWrapperStyle}
              className={`${this.mainClass}__header-wrapper`}>
              <Header theme='bright' noLogo={true} />
            </div>
            <WideFragmentIcono sources={sources} isActive={true} />
            <div
              style={textsStyle}
              className={`${this.mainClass}__texts`}>
              <div className={`${this.mainClass}__supertitle`}>
                {currentFragment?.supertitle}
              </div>
              <div className={`${this.mainClass}__kicker`}>
                {currentFragment?.kicker}
              </div>
            </div>
          </>
        }} />
      </div>
    )
  }
}

export type { Props }
export default App
