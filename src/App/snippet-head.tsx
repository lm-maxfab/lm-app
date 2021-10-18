import { Component, JSX } from 'preact'
import clss from 'classnames'
import { SheetBase } from '../modules/sheet-base'
import './snippet-head.css'
import Header from './components/Header'
import Menu from './components/Menu'
import Parallax from '../modules/le-monde/components/Parallax'
import {
  Fragment as FragmentInterface,
  PageSettings,
  Region,
  Thematic
} from './types'
import getCurrentDownlink from '../modules/le-monde/utils/get-current-downlink'
import clamp from '../modules/le-monde/utils/clamp'
import selectVideoSourceOnDownlink from './utils/select-video-source-on-downlink'
import WideIcono from './components/WideIcono'
import chevron from './assets/chevron.svg'
import Svg from '../modules/le-monde/components/Svg'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  sheetBase?: SheetBase
  currentFragmentId?: string
}

interface State {
  isMenuOpen: boolean|null
}

const initDownLink = getCurrentDownlink() ?? 4

class App extends Component<Props, State> {
  mainClass: string = 'lm-app-fragments-snippet-head'
  state: State = {
    isMenuOpen: null
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
      isMenuOpen: curr.isMenuOpen === null ? true : !curr.isMenuOpen
    }))
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props, state } = this

    // Logic
    if (state.isMenuOpen === true) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''

    const sheetBase = props.sheetBase ?? new SheetBase()
    const fragments = (sheetBase.collection('fragments').value as unknown as FragmentInterface[]).filter(frag => frag.publish === true)
    const regions = sheetBase.collection('regions').value as unknown as Region[]
    const thematics = sheetBase.collection('thematics').value as unknown as Thematic[]
    const pageSettings = sheetBase.collection('page_settings').entry('settings').value as unknown as PageSettings
    const currentFragment = fragments.find(fragment => fragment.id === props.currentFragmentId)
    const desktopVideoSources = [
      { height: 1080, url: currentFragment?.vimeo_video_desktop_1080_url },
      { height: 720, url: currentFragment?.vimeo_video_desktop_720_url },
      { height: 540, url: currentFragment?.vimeo_video_desktop_540_url },
      { height: 360, url: currentFragment?.vimeo_video_desktop_360_url }
    ]
    const mobileVideoSources = [
      { height: 648, url: currentFragment?.vimeo_video_mobile_648_url },
      { height: 432, url: currentFragment?.vimeo_video_mobile_432_url }
    ]
    const desktopPosterSources = [
      { height: 1125, url: `https://assets-decodeurs.lemonde.fr/redacweb/5-2110-fragments-icono/${props.currentFragmentId}_wide_dk_hd.jpg` },
      { height: 750, url: `https://assets-decodeurs.lemonde.fr/redacweb/5-2110-fragments-icono/${props.currentFragmentId}_wide_dk_sd.jpg` }
    ]
    const mobilePosterSources = [
      { height: 1560, url: `https://assets-decodeurs.lemonde.fr/redacweb/5-2110-fragments-icono/${props.currentFragmentId}_wide_sm_hd.jpg` },
      { height: 960, url: `https://assets-decodeurs.lemonde.fr/redacweb/5-2110-fragments-icono/${props.currentFragmentId}_wide_sm_sd.jpg` }
    ]
    const desktopVideoSource = selectVideoSourceOnDownlink(desktopVideoSources, initDownLink, { ratio: 1920 / 1080, bitSize: 3, fps: 25, compressionRatio: 0.01, availableDownlinkRatio: 0.5 })
    const mobileVideoSource = selectVideoSourceOnDownlink(mobileVideoSources, initDownLink, { ratio: 540 / 648, bitSize: 3, fps: 25, compressionRatio: 0.01, availableDownlinkRatio: 0.5 })
    const hlsDesktopVideoSource = currentFragment?.vimeo_video_desktop_hls_url
    const hlsMobileVideoSource = currentFragment?.vimeo_video_mobile_hls_url
    const desktopPosterSource = selectVideoSourceOnDownlink(desktopPosterSources, initDownLink, { ratio: 1.6, bitSize: 3, fps: 10, compressionRatio: 0.04, availableDownlinkRatio: 0.5 })
    const mobilePosterSource = selectVideoSourceOnDownlink(mobilePosterSources, initDownLink, { ratio: 1.2, bitSize: 3, fps: 10, compressionRatio: 0.04, availableDownlinkRatio: 0.5 })
    const isDesktop = document.documentElement.clientWidth > 800
    const videoUrl = isDesktop ? desktopVideoSource : mobileVideoSource
    const hlsVideoUrl = isDesktop ? hlsDesktopVideoSource : hlsMobileVideoSource
    const posterUrl = isDesktop ? desktopPosterSource : mobilePosterSource

    // Classes
    const menuClass = state.isMenuOpen === true ? `${this.mainClass}_menu-open` : `${this.mainClass}_menu-closed`
    const classes: string = clss(this.mainClass, menuClass, props.className)
    const inlineStyle = { ...props.style }

    // Display
    return (
      <div className={classes} style={inlineStyle}>
        <Menu
          open={this.state.isMenuOpen ?? false}
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
          fragments={fragments}
          showArticles={pageSettings.show_articles_in_snippet_menu} />
        <Parallax anchor={0} render={(p) => {
          const cleanP = Number.isNaN(p) ? 0 : p
          const scrolled = clamp(cleanP, 0, 1)
          const headerBgOpacity = clamp((scrolled - .5) * 2, 0, 1)
          const headerBorderOpacity = .2 * (1 - scrolled)
          const iconoTop = `${scrolled / 1.5 * 100}%`
          const textsOpacity = clamp(1 - scrolled * 4, 0, 1)
          const opacifierOpacity = (currentFragment?.snippet_opacifier_opacity ?? 0) * clamp((1 - scrolled * 4), 0, 1)
          const chevronOpacity = clamp(1 - scrolled * 4, 0, 1)
          const headerWrapperStyle: JSX.CSSProperties = { backgroundColor: `rgb(0, 0, 0, ${headerBgOpacity})`, borderBottom: `1px rgb(255, 255, 255, ${headerBorderOpacity}) solid` }
          const iconoStyle: JSX.CSSProperties = { top: iconoTop }
          const textsStyle: JSX.CSSProperties = { opacity: textsOpacity }
          const chevronStyle: JSX.CSSProperties = { opacity: chevronOpacity }
          return <>
            <div
              style={headerWrapperStyle}
              className={`${this.mainClass}__header-wrapper`}>
              <Header
                theme='bright'
                noLogo={true}
                onButtonClick={this.toggleMenu}
                showButton={pageSettings.show_header_button_in_snippet}
                buttonDesktopText={pageSettings.snippet_header_button_desktop_text}
                buttonMobileText={pageSettings.snippet_header_button_mobile_text} />
            </div>
            <WideIcono
              style={iconoStyle}
              loadVideo
              imageUrl={posterUrl}
              hlsVideoUrl={hlsVideoUrl}
              videoUrl={videoUrl}
              videoType='video/mp4'
              opacifierOpacity={opacifierOpacity} />
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
            <div
              style={chevronStyle}
              className={`${this.mainClass}__chevron`}>
              <Svg src={chevron} />
            </div>
          </>
        }} />
      </div>
    )
  }
}

export type { Props }
export default App
