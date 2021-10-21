import { Component, JSX } from 'preact'
import clss from 'classnames'
import Paginator from '../modules/le-monde/components/Paginator'
import FixedLongformPanels from './components/FixedLongformPanels'
import { SheetBase } from '../modules/sheet-base'
import Menu from './components/Menu'
import Svg from '../modules/le-monde/components/Svg'
import { Fragment as FragmentInterface, IntroImage, PageSettings, Region, Thematic } from './types'
import chevron from './assets/chevron.svg'
import './longform.css'
import Header from './components/Header'

type IOE = IntersectionObserverEntry

interface Props {
  className?: string
  style?: JSX.CSSProperties
  sheetBase?: SheetBase
}

interface State {
  activePanelPos: number|null
  isMenuOpen: boolean
}

class App extends Component<Props, State> {
  mainClass: string = 'lm-app-fragments-longform'
  state: State = {
    activePanelPos: null,
    isMenuOpen: false
  }
  dirtyIsreadyToActivatePanel: boolean = false

  constructor (props: Props) {
    super(props)
    this.activatePanel = this.activatePanel.bind(this)
    this.resetScroll = this.resetScroll.bind(this)
    this.toggleMenu = this.toggleMenu.bind(this)
  }

  componentDidMount () {
    window.setTimeout(() => {
      this.resetScroll()
      this.activatePanel(null, true)
    }, 10)
    window.setTimeout(() => {
      this.resetScroll()
      this.activatePanel(null, true)
    }, 50)
    window.setTimeout(() => {
      this.resetScroll()
      this.activatePanel(null, true)
    }, 120)
    window.setTimeout(() => {
      this.resetScroll()
      this.activatePanel(0, true)
    }, 250)
    window.setTimeout(() => {
      this.dirtyIsreadyToActivatePanel = true
    }, 500)
  }

  activatePanel (pos: number|null, force: boolean = false) {
    if (force || this.dirtyIsreadyToActivatePanel) this.setState({ activePanelPos: pos })
  }

  resetScroll () {
    this.activatePanel(0, true)
    window.scrollTo(0, 0)
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
    const introImages = (sheetBase.collection('intro_images').value as unknown as IntroImage[])
    const fragments = (sheetBase.collection('fragments').value as unknown as FragmentInterface[])
      .filter(fragment => fragment.publish)
      .sort((a, b) => a.order - b.order)
    const regions = sheetBase.collection('regions').value as unknown as Region[]
    const thematics = sheetBase.collection('thematics').value as unknown as Thematic[]
    const pageSettings = sheetBase.collection('page_settings').entry('settings').value as unknown as PageSettings

    // Logic
    if (state.isMenuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''

    // Logic
    const introImagesSlots = introImages.map((introImage, introImagePos) => {
      const slotStyle: JSX.CSSProperties = {
        height: `calc(${introImage.container_height ?? 100} * var(--vh))`,
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        opacity: introImagePos === this.state.activePanelPos ? '1' : '0',
        transition: 'opacity 600ms'
      }
      const imageWrapperStyle: JSX.CSSProperties = {
        position: 'relative',
        top: `calc(${introImage.v_position})`,
        height: `calc(${introImage.height ?? 100} * var(--vh))`
      }
      return <div
        style={slotStyle}
        className={`${this.mainClass}__intro-image-slot`}>
        <div
        style={imageWrapperStyle}
        className={`${this.mainClass}__intro-image-wrapper`}>
          <img style={{
            position: 'relative',
            left: introImage.h_position ?? '0%',
            transform: `translateX(calc(-1 * ${introImage.h_position ?? '0%'}))`,
            display: 'block',
            maxWidth: 'unset',
            height: '100%',
            opacity: (introImage.opacity ?? 100) / 100
          }} src={introImage.url} />
        </div>
      </div>
    })

    const wideFragmentsSlots = fragments
      .filter(fragment => fragment.display === 'wide')
      .sort((a, b) => a.order - b.order)
      .map((fragment, fragmentPos) => {
        const slotStyle: JSX.CSSProperties = { height: `calc(100 * var(--vh))` }
        return <div
          style={slotStyle}
          className={`${this.mainClass}__wide-fragment-slot`}>
          <a href={fragment.url}>
            <div className={`${this.mainClass}__wide-fragment-supertitle`}>{fragment.supertitle}</div>
            <div className={`${this.mainClass}__wide-fragment-title`}>{fragment.title}</div>
          </a>
        </div>
      })

    const gridFragmentsSlot = <div className={`${this.mainClass}__grid-fragments-slot`}>
      {fragments
        .filter(fragment => fragment.display === 'grid')
        .sort((a, b) => a.order - b.order)
        .map(fragment => {
          const imageSlotStyle = { backgroundImage: fragment?.id !== undefined ? `url(https://assets-decodeurs.lemonde.fr/redacweb/5-2110-fragments-icono/${fragment.id}_grid_hd.jpg)` : '' }
          const imageSlotOpacifierStyle = { backgroundColor: `rgb(0, 0, 0, ${(fragment?.longform_grid_snippet_opacifier_opacity ?? 27) / 100})` }
          return <div className={`${this.mainClass}__related-fragment`}>
            <a href={fragment.url}>
              <div style={imageSlotStyle} className={`${this.mainClass}__related-fragment-image`}>
                <div style={imageSlotOpacifierStyle} className={`${this.mainClass}__related-fragment-image-opacifier`} />
                <div className={`${this.mainClass}__related-fragment-image-texts`}>
                  <div className={`${this.mainClass}__related-fragment-image-supertitle`}>{fragment?.supertitle}</div>
                  <div className={`${this.mainClass}__related-fragment-image-supertitle-mobile`}>{fragment?.supertitle_mobile}</div>
                  <div className={`${this.mainClass}__related-fragment-image-title`}>{fragment?.title}</div>
                </div>
              </div>
            </a>
          </div>
        })
      }
      <div className={`${this.mainClass}__credits`}>
        <div className={`${this.mainClass}__credits-inner`}>
          <p><strong>Direction éditoriale</strong> : Nicolas Chapuis, Pierre Jaxel Truer, Dominique Perrin</p>
          <p><strong>Chef d’édition</strong> : Sabine&nbsp;Ledoux</p>
          <p><strong>Edition</strong> : Margaux&nbsp;Velikonia, Lucile&nbsp;Torterat, Nadir&nbsp;Chougar, Boris&nbsp;Bastide, Geneviève&nbsp;Caux, Agnès&nbsp;Rastouil</p>
          <p><strong>Photo</strong> : Nicolas&nbsp;Jimenez, Marie&nbsp;Sumalla, Laurence&nbsp;Lagrange, Pauline&nbsp;Eiferman, Amaury&nbsp;da&nbsp;Cunha, Laurence&nbsp;Vecten, Laurence&nbsp;Cornet, Patrice&nbsp;Birot, Audrey&nbsp;Delaporte, Odhrán&nbsp;Dunne, Elie&nbsp;Villette, Nadja&nbsp;Delmouly, Charlotte&nbsp;Cervatius</p>
          <p><strong>Design et développement</strong> : Melina&nbsp;Zerbib, Thomas&nbsp;Steffen, Maxime&nbsp;Fabas, Agathe&nbsp;Dahyot, Solène&nbsp;Reveney</p>
          <p>Service correction du <em>Monde</em></p>
        </div>
      </div>
    </div>

    // const gridFragmentsSlot = <div className={`${this.mainClass}__grid-fragments-slot`}>
    //   {fragments
    //     .filter(fragment => fragment.display === 'grid')
    //     .sort((a, b) => a.order - b.order)
    //     .map((fragment, fragmentPos) => {
    //       return <div className={`${this.mainClass}__grid-fragment`}>
    //         <div className={`${this.mainClass}__grid-fragment-supertitle`}>{fragment.supertitle}</div>
    //         <div className={`${this.mainClass}__grid-fragment-title`}>{fragment.title}</div>
    //       </div>
    //     })
    //   }
    // </div>

    const scrollableSlots = [
      ...introImagesSlots,
      ...wideFragmentsSlots,
      gridFragmentsSlot
    ]
    
    const onSlotEnterFromBottom = (pos: number) => (pos !== scrollableSlots.length)
      ? this.activatePanel(pos)
      : this.activatePanel(null)
    const onSlotLeaveFromBottom = (pos: number) => (pos !== 0)
      ? this.activatePanel(pos - 1)
      : this.activatePanel(null)

    // Classes
    const isIntro = state.activePanelPos !== null && state.activePanelPos < introImages.length
    const isWide = state.activePanelPos !== null && state.activePanelPos >= introImages.length && state.activePanelPos < introImages.length + wideFragmentsSlots.length
    const isGrid = state.activePanelPos && !isIntro && !isWide
    const isIntroClass = isIntro ? `${this.mainClass}_is-intro` : ''
    const isWideClass = isWide ? `${this.mainClass}_is-wide` : ''
    const isGridClass = isGrid ? `${this.mainClass}_is-grid` : ''
    const needForIncentive = state.activePanelPos !== null && state.activePanelPos < 1
    const needForIncentiveClass = needForIncentive ? `${this.mainClass}_need-incentive` : ''
    const needForChevronClass = isIntro ? `${this.mainClass}_need-chevron` : ''
    const menuClass = state.isMenuOpen ? `${this.mainClass}_menu-open` : `${this.mainClass}_menu-closed`
    const classes: string = clss(
      this.mainClass,
      menuClass,
      needForChevronClass,
      needForIncentiveClass,
      props.className,
      isIntroClass,
      isWideClass,
      isGridClass
    )
    const inlineStyle: JSX.CSSProperties = {
      ...props.style,
      position: 'relative',
      width: '100%',
      overflow: 'hidden'
    }

    // Display
    return (
      <div className={classes} style={inlineStyle}>
        <Header
          theme={isWide ? 'bright' : 'dark'}
          onButtonClick={this.toggleMenu}
          showButton={pageSettings.show_header_button_in_longform}
          buttonDesktopText={pageSettings.longform_header_button_desktop_text}
          buttonMobileText={pageSettings.longform_header_button_mobile_text} />
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
        <div className={`${this.mainClass}__incentive`}>Découvrez les 100&nbsp;reportages</div>
        <div className={`${this.mainClass}__chevron`}><Svg src={chevron} /></div>
        <div className={`${this.mainClass}__content`}>
          <div className={`${this.mainClass}__paginator`}>
            <Paginator
              onEnterFromBottom={onSlotEnterFromBottom}
              onLeaveFromBottom={onSlotLeaveFromBottom}>
              {scrollableSlots}
            </Paginator>
          </div>
          <div className={`${this.mainClass}__panels`}>
            <FixedLongformPanels
              introImages={introImages}
              fragments={fragments}
              activePanel={this.state.activePanelPos} />
          </div>
        </div>
      </div>
    )
  }
}

export type { Props }
export default App
