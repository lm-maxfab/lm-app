import { Component, JSX } from 'preact'
import clss from 'classnames'
import { SheetBase } from '../modules/sheet-base'
import './snippet-head.css'
import Header from './components/Header'
import Menu from './components/Menu'
import WideFragmentIcono from './components/WideFragmentIcono'
import Parallax from '../modules/le-monde/components/Parallax'
import {
  Fragment as FragmentInterface,
  FragmentSources,
  PageSettings,
  Region,
  Thematic
} from './types'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  sheetBase?: SheetBase
  currentFragmentId?: string
}

interface State {
  isMenuOpen: boolean
}

class App extends Component<Props, State> {
  mainClass: string = 'lm-app-fragments-snippet-head'
  state: State = {
    isMenuOpen: false
  }

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
    this.toggleMenu = this.toggleMenu.bind(this)
  }

  /* * * * * * * * * * * * * * *
   * METHODS
   * * * * * * * * * * * * * * */
  toggleMenu () {
    this.setState(curr => ({
      ...curr,
      isMenuOpen: !curr.isMenuOpen
    }))
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props, state } = this

    // Logic
    const sheetBase = props.sheetBase ?? new SheetBase()
    const fragments = (sheetBase.collection('fragments').value as unknown as FragmentInterface[]).filter(frag => frag.publish === true)
    const regions = sheetBase.collection('regions').value as unknown as Region[]
    const thematics = sheetBase.collection('thematics').value as unknown as Thematic[]
    const pageSettings = sheetBase.collection('page_settings').entry('settings').value as unknown as PageSettings
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

    if (state.isMenuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''

    // Classes
    const menuClass = state.isMenuOpen ? `${this.mainClass}_menu-open` : `${this.mainClass}_menu-closed`
    const classes: string = clss(this.mainClass, menuClass, props.className)
    const inlineStyle = { ...props.style }

    // Display
    return (
      <div className={classes} style={inlineStyle}>
        <Menu
          open={this.state.isMenuOpen}
          onCloseButtonClick={this.toggleMenu}
          aboutTitle={pageSettings.about_title}
          aboutContent={pageSettings.about_content}
          aboutBackgroundImageDesktopUrl={pageSettings.about_background_image_desktop_url}
          aboutBackgroundImageMobileUrl={pageSettings.about_background_image_mobile_url}
          aboutBackgroundImageDesktopCenter={pageSettings.about_background_image_desktop_center}
          aboutBackgroundImageMobileCenter={pageSettings.about_background_image_mobile_center}
          aboutFranceMapUrl={pageSettings.about_france_map_url}
          filtersIncentive={pageSettings.filters_incentive}
          regions={regions}
          thematics={thematics}
          fragments={fragments} />
        <Parallax render={(p) => {
          const cleanP = Number.isNaN(p) ? 0 : p
          const scrolled = Math.min(Math.max(cleanP, 0), 1)
          const headerWrapperStyle: JSX.CSSProperties = {
            backgroundColor: `rgb(0, 0, 0, ${scrolled})`,
            borderBottom: `1px rgb(255, 255, 255, ${.3 * (1 - scrolled)}) solid`
          }
          const textsStyle: JSX.CSSProperties = {
            top: `0%`,
            opacity: 1 - scrolled
          }
          return <>
            <div
              style={headerWrapperStyle}
              className={`${this.mainClass}__header-wrapper`}>
              <Header
                theme='bright'
                noLogo={true}
                onButtonClick={this.toggleMenu} />
            </div>
            <WideFragmentIcono
              sources={sources}
              isActive={true} />
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
