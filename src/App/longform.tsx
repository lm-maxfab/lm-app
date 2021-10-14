import { Component, JSX } from 'preact'
import clss from 'classnames'
import { SheetBase } from '../modules/sheet-base'
import Header from './components/Header'
import Intro from './components/Intro'
import Home from './components/HomePage'
import Menu from './components/Menu'
import getCurrentDownlink from '../modules/le-monde/utils/get-current-downlink'
import IOComponent from '../modules/le-monde/components/IntersectionObserver'
import {
  Fragment as FragmentInterface,
  FragmentSources,
  IntroImage,
  HomeImage,
  PageSettings,
  Region,
  Thematic
} from './types'
import './longform.css'
import WideFragmentIcono from './components/WideFragmentIcono'

type IOE = IntersectionObserverEntry

const downlinkAtLoad = getCurrentDownlink() ?? 0

interface Props {
  className?: string
  style?: JSX.CSSProperties
  sheetBase?: SheetBase
}

interface State {
  currentSectionId: string|null
  currentWideFragmentId: string|null
  isMenuOpen: boolean
}

class App extends Component<Props, State> {
  mainClass: string = 'lm-app-fragments-longform'
  state: State = {
    currentSectionId: 'intro',
    currentWideFragmentId: null,
    isMenuOpen: false
  }

  constructor (props: Props) {
    super(props)
    this.asyncSetState = this.asyncSetState.bind(this)
    this.detectCurrentSectionId = this.detectCurrentSectionId.bind(this)
    this.detectCurrentWideFragmentId = this.detectCurrentWideFragmentId.bind(this)
    this.resetScrollPosition = this.resetScrollPosition.bind(this)
    this.toggleMenu = this.toggleMenu.bind(this)
  }

  async asyncSetState (updater: any) {
    return new Promise(resolve => { this.setState(updater, () => resolve(true)) })
  }

  componentDidMount () {
    window.setTimeout(this.resetScrollPosition, 5)
    window.setTimeout(this.resetScrollPosition, 50)
    window.setTimeout(this.resetScrollPosition, 500)
  }

  resetScrollPosition () {
    window.scrollTo(0, 0)
    this.setState({
      currentSectionId: 'intro',
      currentWideFragmentId: null
    })
  }

  async detectCurrentSectionId (ioe: IOE, prevSectionName: string|null, nextSectionName: string|null) {
    if (ioe.isIntersecting) {
      if (nextSectionName !== 'wide') return await this.asyncSetState({ currentSectionId: nextSectionName, currentWideFragmentId: null })
      else return await this.asyncSetState({ currentSectionId: nextSectionName })
    } else {
      const separatorPos = ioe.boundingClientRect.y
      if (separatorPos <= 0) return
      if (prevSectionName !== 'wide') return await this.asyncSetState({ currentSectionId: prevSectionName, currentWideFragmentId: null })
      else return await this.asyncSetState({ currentSectionId: prevSectionName })
    }
  }

  async detectCurrentWideFragmentId (ioe: IOE, prevFragmentId: string|null, nextFragmentId: string|null) {
    if (ioe.isIntersecting) return await this.asyncSetState({ currentWideFragmentId: nextFragmentId })
    else {
      const separatorPos = ioe.boundingClientRect.y
      if (separatorPos <= 0) return
      return await this.asyncSetState({ currentWideFragmentId: prevFragmentId })
    }
  }

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

    // Extract data
    const sheetBase = props.sheetBase ?? new SheetBase()
    const fragments = (sheetBase.collection('fragments').value as unknown as FragmentInterface[]).filter(frag => frag.publish === true)
    const wideFragments = fragments.filter(fragment => fragment.display === 'wide')
    const gridFragments = fragments.filter(fragment => fragment.display === 'grid')
    const introImages = sheetBase.collection('intro_images').value as unknown as IntroImage[]
    const homeImages = sheetBase.collection('home_images').value as unknown as HomeImage[]
    const regions = sheetBase.collection('regions').value as unknown as Region[]
    const thematics = sheetBase.collection('thematics').value as unknown as Thematic[]
    const pageSettings = sheetBase.collection('page_settings').entry('settings').value as unknown as PageSettings
    const introFirstParagraphChunk = pageSettings.intro_first_paragraph_chunk

    // Logic
    if (state.isMenuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''

    // Classes
    const menuClass = state.isMenuOpen ? `${this.mainClass}_menu-open` : `${this.mainClass}_menu-closed`
    const classes: string = clss(this.mainClass, menuClass, props.className)
    const inlineStyle = { ...props.style }

    // Display
    return (
      <div className={classes} style={inlineStyle}>
        
        {/* Header */}
        <Header
          theme='dark'
          onButtonClick={this.toggleMenu}
          showButton={pageSettings.show_header_button_in_longform}
          buttonDesktopText={pageSettings.longform_header_button_desktop_text}
          buttonMobileText={pageSettings.longform_header_button_mobile_text} />
        
        {/* Menu */}
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
          fragments={fragments}
          showArticles={pageSettings.show_articles_in_longform_menu} />
        
        {/* Intro */}
        <IOComponent
          callback={ioe => this.detectCurrentSectionId(ioe, null, 'intro')}
          render={() => <div />} />
        <Intro
          show_paragraph={state.currentSectionId === 'intro'}
          paragraph_basis={introFirstParagraphChunk}
          images={introImages} />
        
        {/* Home */}
        <IOComponent
          callback={ioe => this.detectCurrentSectionId(ioe, 'intro', 'home')}
          render={() => <div />} />
        <div className={`${this.mainClass}__home-scrolling-area`} />
        
        {/* Wide Fragments */}
        <IOComponent
          callback={ioe => this.detectCurrentSectionId(ioe, 'home', 'wide')}
          render={() => <div />} />
        {wideFragments.map((fragment, fragmentPos, fragmentsArr) => {
          const prevFragment: FragmentInterface|undefined = fragmentPos > 0 ? fragmentsArr[fragmentPos - 1] : undefined
          const prevFragmentId = prevFragment?.id ?? null
          return <>
            <IOComponent
              callback={ioe => this.detectCurrentWideFragmentId(ioe, prevFragmentId, fragment.id)}
              render={() => <div />} />
            <a href={fragment.url} target='_blank'>
              <div className={`${this.mainClass}__wide-fragment-scrolling-area`}>
                <div className={`${this.mainClass}__wide-fragment-scrolling-area-supertitle`}>
                  {fragment.supertitle}
                </div>
                <div className={`${this.mainClass}__wide-fragment-scrolling-area-title`}>
                  {fragment.title}
                </div>
              </div>
            </a>
          </>
        })}

        {/* Grid Fragments */}
        <IOComponent
          callback={async (ioe) => {
            const lastWideFragment = wideFragments.slice(-1)[0]
            const lastWideFragmentId = lastWideFragment.id
            await this.detectCurrentSectionId(ioe, 'wide', 'grid')
            this.detectCurrentWideFragmentId(ioe, lastWideFragmentId, null)
          }}
          render={() => <div />} />
        <div className={`${this.mainClass}__grid`}>
        <div className={`${this.mainClass}__grid-inner`}>
            {gridFragments.map(fragment => {
              const showHd = downlinkAtLoad >= 2
              const innerStyle: JSX.CSSProperties = {
                backgroundImage: `url(${showHd ? fragment.grid_cover_hd_url : fragment.grid_cover_sd_url})`,
                backgroundPosition: `${fragment.grid_cover_center}`
              }
              return <div className={`${this.mainClass}__grid-fragment`}>
                <div style={innerStyle} className={`${this.mainClass}__grid-fragment-inner`}>
                  <div className={`${this.mainClass}__grid-fragment-texts`}>
                    <div className={`${this.mainClass}__grid-fragment-supertitle`}>{fragment.supertitle}</div>
                    <div className={`${this.mainClass}__grid-fragment-title`}>{fragment.title}</div>
                  </div>
                </div>
              </div>
            })}
          </div>
        </div>

        <Home
          images={homeImages}
          isVisible={state.currentSectionId === 'home'}
          activate={state.currentSectionId === 'home'} />

        {wideFragments.map(fragment => {
          const sources: FragmentSources = {
            vimeo_video_desktop_1080_url: fragment.vimeo_video_desktop_1080_url,
            vimeo_video_desktop_720_url: fragment.vimeo_video_desktop_720_url,
            vimeo_video_desktop_540_url: fragment.vimeo_video_desktop_540_url,
            vimeo_video_desktop_360_url: fragment.vimeo_video_desktop_360_url,
            vimeo_video_mobile_648_url: fragment.vimeo_video_mobile_648_url,
            vimeo_video_mobile_432_url: fragment.vimeo_video_mobile_432_url,
            decodeurs_video_desktop_url: fragment.decodeurs_video_desktop_url,
            decodeurs_video_mobile_url: fragment.decodeurs_video_mobile_url,
            video_poster_desktop_url: fragment.video_poster_desktop_url,
            video_poster_mobile_url: fragment.video_poster_mobile_url,
            wide_cover_desktop_hd_url: fragment.wide_cover_desktop_hd_url,
            wide_cover_desktop_sd_url: fragment.wide_cover_desktop_sd_url,
            wide_cover_desktop_center: fragment.wide_cover_desktop_center,
            wide_cover_mobile_hd_url: fragment.wide_cover_mobile_hd_url,
            wide_cover_mobile_sd_url: fragment.wide_cover_mobile_sd_url,
            wide_cover_mobile_center: fragment.wide_cover_mobile_center,
            grid_cover_hd_url: fragment.grid_cover_hd_url,
            grid_cover_sd_url: fragment.grid_cover_sd_url,
            grid_cover_center: fragment.grid_cover_center,
            menu_thumb_hd_url: fragment.menu_thumb_hd_url,
            menu_thumb_sd_url: fragment.menu_thumb_sd_url
          }
          return <WideFragmentIcono
            fragmentUrl={fragment.url}
            isActive={fragment.id === state.currentWideFragmentId && state.currentSectionId === 'wide'}
            playVideo={fragment.id === state.currentWideFragmentId && state.currentSectionId === 'wide'}
            sources={sources} />
        })}
      </div>
    )
  }
}

export type { Props }
export default App
