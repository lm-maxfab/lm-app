import { Component, JSX } from 'preact'
import Scrollgneugneu, { PropsPageData, PropsBlockData, PropsStickyBlockData } from '../../modules/layouts/Scrollgneugneu'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import './styles.scss'
import { GeneralSettings } from '../types'
import generateNiceColor from '../../modules/utils/generate-nice-color'
import { generateContentPage, generateParagraph, generateSentences } from '../../modules/utils/generate-html-placeholders'
import Footer, { Props as FooterProps } from '../../modules/components/Footer'
import StrToVNode from '../../modules/components/StrToVNodes'
import { logEvent, EventNames } from '../../modules/utils/lm-analytics'

interface Props extends InjectedProps {}
interface State {
  scrollStartedLogged: boolean
  longformHalfLogged: boolean
  longformEndLogged: boolean
  footerVisibleLogged: boolean
}

const generalSettings: GeneralSettings = {
  id: 'general-settings',
  thresholdOffset: '80vh',
  bgColorTransitionDuration: '600ms',
  lazyLoadDistance: 2,
  viewportHeight: '100vh',
  topOffset: 0,
  headerCustomClass: 'analytics-demo-header',
  headerCustomCss: `
    /* Header */
    .analytics-demo-header .lm-article-header__nav-item {
      padding: 4px 12px;
      margin-right: 4px;
      border: none;
      border-radius: 1000px;
      background: black;
      color: white;
      font-family: var(--ff-marr-sans);
      font-weight: 700;
      font-size: 12px;
      opacity: .7;
      transition: opacity 600ms;
    }

    .analytics-demo-header .lm-article-header__nav-item.lm-article-header__nav-item_active {
      opacity: 1;
    }

    .analytics-demo-header .lm-article-header__nav-item:hover {
      opacity: .95;
    }

    .analytics-demo-header .lm-article-header__nav-item:nth-last-child(2) {
      margin-right: 118px;
    }

    /* Pages */
    .analytics-demo-longform-page {
      background: white;
      padding: 64px;
    }
    .analytics-demo-longform-page > .content-page > * {
      margin-bottom: 16px;
    }
    .analytics-demo-longform-page .title,
    .analytics-demo-longform-page .intertitle {
      font-family: var(--ff-marr-sans-condensed);
      font-weight: 700;
    }
    .analytics-demo-longform-page .paragraph {
      font-family: var(--ff-the-antiqua-b);
    }
    @media (max-width: 1024px) {
      .analytics-demo-longform-page {
        padding: 24px;
      }
    }
    .lm-paginator-page:first-child .analytics-demo-longform-page {
      margin-top: 40vh;
    }
    .lm-paginator-page:last-child .analytics-demo-longform-page {
      margin-bottom: 40vh;
    }`,
  headerNavItemsAlign: 'center'
}
const pagesData: PropsPageData[] = [{
  bgColor: generateNiceColor(),
  showHeader: true,
  showNav: true,
  headerLogoFill1: 'black',
  headerLogoFill2: 'rgb(0, 0, 0, .3)',
  chapterName: 'Chapitre 1',
  isChapterHead: true,
  blocks: [{
    depth: 'scroll',
    content: `<div class="analytics-demo-longform-page">${generateContentPage(6)}</div>`,
    layout: 'left-half',
    mobileLayout: '4/5'
  }]
}, {
  bgColor: generateNiceColor(),
  showHeader: true,
  showNav: true,
  headerLogoFill1: 'black',
  headerLogoFill2: 'rgb(0, 0, 0, .3)',
  chapterName: 'Chapitre 2',
  isChapterHead: true,
  blocks: [{
    depth: 'scroll',
    content: `<div class="analytics-demo-longform-page">${generateContentPage(6)}</div>`,
    layout: 'right-half',
    mobileLayout: '4/5(1/5)'
  }]
}, {
  bgColor: generateNiceColor(),
  showHeader: true,
  showNav: true,
  headerLogoFill1: 'black',
  headerLogoFill2: 'rgb(0, 0, 0, .3)',
  chapterName: 'Chapitre 3',
  isChapterHead: true,
  blocks: [{
    depth: 'scroll',
    content: `<div class="analytics-demo-longform-page">${generateContentPage(6)}</div>`,
    layout: 'left-half',
    mobileLayout: '4/5'
  }]
}]

const footerProps: FooterProps = {
  customClass: 'analytics-demo-footer',
  customCss: `
    .analytics-demo-footer {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .analytics-demo-footer .lm-article-footer__shade {
      opacity: .1;
    }

    .analytics-demo-footer .lm-article-footer__above,
    .analytics-demo-footer .lm-article-footer__below {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .analytics-demo-footer .lm-article-footer__thumbnails {
      max-width: 1024px;
    }

    .analytics-demo-footer__title,
    .analytics-demo-footer__intro-paragraph,
    .analytics-demo-footer__cta,
    .analytics-demo-footer__outro-paragraph {
      text-align: center;
      display: block;
    }

    .analytics-demo-footer__title,
    .analytics-demo-footer__intro-paragraph,
    .analytics-demo-footer__outro-paragraph {
      color: white;
    }

    .analytics-demo-footer__title {
      font-family: var(--ff-the-antiqua-b);
      font-weight: 400;
      text-transform: uppercase;
      font-size: 36px;
      margin-top: 64px;
      margin-bottom: 32px;
    }

    .analytics-demo-footer__intro-paragraph,
    .analytics-demo-footer__outro-paragraph {
      font-family: var(--ff-marr-sans);
      max-width: 800px;
      padding: 0 16px;
    }

    .analytics-demo-footer__intro-paragraph {
      margin-bottom: 32px;
    }

    .analytics-demo-footer__cta {
      background: white;
      color: black;
      font-family: var(--ff-marr-sans);
      font-weight: 600;
      font-size: 16px;
      border: none;
      border-radius: 100px;
      padding: 12px 16px;
      cursor: pointer;
      margin-bottom: 32px;
    }

    .analytics-demo-footer__outro-paragraph {
      font-size: 14px;
      opacity: .7;
      margin-top: 32px;
      margin-bottom: 64px;
    }
  `,
  bgColor: 'black',
  shadeFromPos: '30%',
  shadeFromColor: 'transparent',
  shadeToPos: '100%',
  shadeToColor: generateNiceColor(),
  textBelow: <StrToVNode content={`
    <span class="analytics-demo-footer__outro-paragraph">
      ${generateSentences(2).join('.<br />')}.
    </span>
  `} />,
  visibilityThreshold: .2
}

class Longform extends Component<Props, State> {
  static clss: string = 'analytics-demo-longform'
  clss = Longform.clss
  state: State = {
    scrollStartedLogged: false,
    longformHalfLogged: false,
    longformEndLogged: false,
    footerVisibleLogged: false
  }

  constructor (props: Props) {
    super(props)
    this.logScrollStarted = this.logScrollStarted.bind(this)
    this.logLongformHalf = this.logLongformHalf.bind(this)
    this.logLongformEnd = this.logLongformEnd.bind(this)
    this.logFooterVisible = this.logFooterVisible.bind(this)
    this.logFooterClick = this.logFooterClick.bind(this)
  }

  componentDidMount(): void {
    window.addEventListener('scroll', this.logScrollStarted)
  }

  componentWillUnmount(): void {
    window.removeEventListener('scroll', this.logScrollStarted)
  }

  logScrollStarted () {
    if (this.state.scrollStartedLogged) return
    window.removeEventListener('scroll', this.logScrollStarted)
    this.setState({ scrollStartedLogged: true })
    logEvent(EventNames.SCROLL_STARTED)
  }

  logLongformHalf () {
    if (this.state.longformHalfLogged) return
    this.setState({ longformHalfLogged: true })
    logEvent(EventNames.SCRLLGNGN_HALF_REACHED)
  }

  logLongformEnd () {
    if (this.state.longformEndLogged) return
    this.setState({ longformEndLogged: true })
    logEvent(EventNames.SCRLLGNGN_END_REACHED)
  }

  logFooterVisible () {
    if (this.state.footerVisibleLogged) return
    this.setState({ footerVisibleLogged: true })
    logEvent(EventNames.FOOTER_VISIBLE)
  }

  logFooterClick () {
    logEvent(EventNames.FOOTER_ITEM_CLICK)
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const {
      props,
      logLongformHalf,
      logLongformEnd,
      logFooterVisible
    } = this
    console.log(this.state)

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      <Scrollgneugneu
        pages={pagesData}
        thresholdOffset={generalSettings?.thresholdOffset}
        bgColorTransitionDuration={generalSettings?.bgColorTransitionDuration}
        stickyBlocksLazyLoadDistance={generalSettings?.lazyLoadDistance}
        stickyBlocksViewportHeight={generalSettings?.viewportHeight}
        stickyBlocksOffsetTop={generalSettings?.topOffset}
        headerCustomClass={generalSettings?.headerCustomClass}
        headerCustomCss={generalSettings?.headerCustomCss}
        headerNavItemsAlign={generalSettings?.headerNavItemsAlign}
        onHalfVisible={logLongformHalf}
        onEndVisible={logLongformEnd} />
      <Footer
        {...footerProps}
        onVisible={logFooterVisible}
        textAbove={<>
          <h3 class="analytics-demo-footer__title">
            Un nom de série
          </h3>
          <button 
            class="analytics-demo-footer__cta"
            onClick={this.logFooterClick}>
            Découvrir la série
          </button>
          <span class="analytics-demo-footer__intro-paragraph">
            <StrToVNode content={generateParagraph()} />
          </span>
        </>}
        articleThumbsData={[...Array(4).fill(null).map(_e => ({
          customClass: 'analytics-demo-article-thumb',
          customCss: `.analytics-demo-article-thumb {
            width: calc(25% - 64px);
            /*margin: 0 32px;*/
            grid-auto-columns: unset;
          }`,
          imageUrl: 'https://assets-decodeurs.lemonde.fr/redacweb/5-2110-fragments-icono/collier-bal_grid_hd.jpg',
          textInsideBottom: <a
            style={{ cursor: 'pointer' }}
            onClick={this.logFooterClick}>
            <StrToVNode content={`<div style="
              color: white;
              font-family: var(--ff-marr-sans);
              font-weight: 700;
              padding: 8px;">
              Un super article
            </div>`} />
          </a>
        }))]} />
    </div>
  }
}

export type { Props, Longform }
export default appWrapper(Longform)
