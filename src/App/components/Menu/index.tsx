import { Component, JSX, VNode } from 'preact'
import clss from 'classnames'
import './styles.css'
import closeIconLg from './assets/close-icon-22.svg'
import closeIconSm from './assets/close-icon-16.svg'
import Svg from '../../../modules/le-monde/components/Svg'
import Header from '../Header'
import { Region, Thematic, Fragment, ShortFragmentWithBetterRels } from '../../types'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  open?: boolean
  onCloseButtonClick?: () => void
  aboutTitle?: VNode
  aboutContent?: VNode
  aboutBackgroundImageDesktopUrl?: string
  aboutBackgroundImageMobileUrl?: string
  aboutBackgroundImageDesktopCenter?: string
  aboutBackgroundImageMobileCenter?: string
  aboutFranceMapUrl?: string
  filtersIncentive?: VNode
  regions?: Region[]
  thematics?: Thematic[]
  fragments?: Fragment[]
  showArticles?: boolean
}

interface State {
  activeFilter: 'region'|'thema'
}

class Menu extends Component<Props, State> {
  mainClass: string = 'frag-menu'
  $root: HTMLDivElement|null = null
  state: State = {
    activeFilter: 'region'
  }

  constructor (props: Props) {
    super(props)
    this.activateFilter = this.activateFilter.bind(this)
  }

  componentDidUpdate (prevProps: Props) {
    if (this.$root === null) return
    if (prevProps.open !== this.props.open) this.$root.scrollTop = 0
  }

  activateFilter (filter: 'region'|'thema') {
    this.setState({ activeFilter: filter })
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props, state } = this

    // Logic
    const onCloseClick = props.onCloseButtonClick ?? (() => {})
    const fragmentsWithBetterRels = (props.fragments ?? [])
      .map(fragment => {
        const arrRegionsId = (fragment.related_regions_ids ?? '').split(',').map(e => e.trim())
        const arrThematicsId = (fragment.related_thematics_ids ?? '').split(',').map(e => e.trim())
        const returned: ShortFragmentWithBetterRels = {
          id: fragment.id,
          order: fragment.order,
          kicker: fragment.kicker,
          supertitle: fragment.supertitle,
          subtitle: fragment.subtitle,
          title: fragment.title,
          url: fragment.url,
          menu_thumb_hd_url: `https://assets-decodeurs.lemonde.fr/redacweb/5-2110-fragments-icono/${fragment.id}_thumb_hd.jpg`, // fragment.menu_thumb_hd_url,
          menu_thumb_sd_url: `https://assets-decodeurs.lemonde.fr/redacweb/5-2110-fragments-icono/${fragment.id}_thumb_sd.jpg`, // fragment.menu_thumb_sd_url,
          related_regions_ids_arr: arrRegionsId,
          related_thematics_ids_arr: arrThematicsId,
          main_region: (props.regions ?? []).find(region => region.id === arrRegionsId[0]),
          main_thematic: (props.thematics ?? []).find(thematic => thematic.id === arrThematicsId[0])
        }
        return returned
      })
    const regionsListData = (props.regions ?? [])
      .filter(() => true)
      .sort((a, b) => a.order - b.order)
      .map(region => ({
        region,
        fragments: fragmentsWithBetterRels
          .filter(frag => frag.related_regions_ids_arr.some(id => id === region.id))
          .sort((a, b) => a.order - b.order)
      }))
    const thematicsListData = (props.thematics ?? [])
      .filter(() => true)
      .sort((a, b) => a.order - b.order)
      .map(thematic => ({
        thematic,
        fragments: fragmentsWithBetterRels
          .filter(frag => frag.related_thematics_ids_arr.some(id => id === thematic.id))
          .sort((a, b) => a.order - b.order)
      }))

    // Classes
    const showArticlesClass = props.showArticles === true ? `${this.mainClass}_show-articles` : `${this.mainClass}_hide-articles`
    const classes: string = clss(this.mainClass, showArticlesClass, props.className)
    const inlineStyle = { ...props.style }

    const viewportWidth = document.documentElement.clientWidth
    const introStyle: JSX.CSSProperties = {
      backgroundImage: viewportWidth > 1200
        ? `url(${props.aboutBackgroundImageDesktopUrl})`
        : `url(${props.aboutBackgroundImageMobileUrl})`,
      backgroundPosition: viewportWidth > 1200
        ? props.aboutBackgroundImageDesktopCenter
        : props.aboutBackgroundImageMobileCenter
    }

    return (
      <div
        ref={n => this.$root = n}
        className={classes}
        style={inlineStyle}>
        <div className={`${this.mainClass}__inner`}>
          <Header theme='dark' noLogo={true} showButton={false} />
          {/* Close button */}
          {props.open && <button className={`${this.mainClass}__close-button`} onClick={() => onCloseClick()}>
            <span className={`${this.mainClass}__close-label`}></span>
            <Svg src={closeIconLg} className={`${this.mainClass}__close-icon ${this.mainClass}__close-icon_lg`} />
            <Svg src={closeIconSm} className={`${this.mainClass}__close-icon ${this.mainClass}__close-icon_sm`} />
          </button>}
          {/* About */}
          <div style={introStyle} className={`${this.mainClass}__about`}>
            <img src={props.aboutFranceMapUrl} className={`${this.mainClass}__about-france-map`} />
            <div className={`${this.mainClass}__about-texts`}>
              <div className={`${this.mainClass}__about-title`}>{props.aboutTitle}</div>
              <div className={`${this.mainClass}__about-content`}>{props.aboutContent}</div>
            </div>
          </div>
          {/* Filters bar */}
          <div className={`${this.mainClass}__filters-bar`}>
            <span className={`${this.mainClass}__filters-incentive`}>{props.filtersIncentive}&nbsp;</span>
            <span
              onClick={() => this.activateFilter('region')}
              className={`${this.mainClass}__filter
              ${this.mainClass}__filter_region
              ${state.activeFilter === 'region' ? `${this.mainClass}__filter_active` : ''}`}>
              zone géographique
            </span>
            <span className={`${this.mainClass}__filter-separator`}>|</span>
            <span
              onClick={() => this.activateFilter('thema')}
              className={`${this.mainClass}__filter
              ${this.mainClass}__filter_type
              ${state.activeFilter === 'thema' ? `${this.mainClass}__filter_active` : ''}`}>
              thématique
            </span>
          </div>
          {/* Lists */}
          <div className={`${this.mainClass}__lists`}>
            <div
              className={`${this.mainClass}__list
              ${this.mainClass}__list_regions
              ${state.activeFilter === 'region' ? `${this.mainClass}__list_active` : ''}`}>
              {regionsListData.map(regionData => (
                <div key={regionData.region.id} className={`${this.mainClass}__list-item`}>
                  <div className={`${this.mainClass}__list-item-title`}>{regionData.region.full_name}</div>
                  <div className={`${this.mainClass}__list-sub-items`}>
                    {regionData.fragments.map(fragment => (
                      <a
                        key={fragment.id}
                        href={fragment.url}
                        className={`${this.mainClass}__list-sub-item`}>
                        <div
                          style={{ backgroundImage: `url(https://assets-decodeurs.lemonde.fr/redacweb/5-2110-fragments-icono/${fragment.id}_thumb_hd.jpg)` }}
                          className={`${this.mainClass}__list-sub-item-image`} />
                        <div className={`${this.mainClass}__list-sub-item-texts`}>
                          <div className={`${this.mainClass}__list-sub-item-label`}>{fragment.main_thematic?.name}</div>
                          <div className={`${this.mainClass}__list-sub-item-title`}>{fragment.title}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div
              className={`${this.mainClass}__list
              ${this.mainClass}__list_thematics
              ${state.activeFilter === 'thema' ? `${this.mainClass}__list_active` : ''}`}>
              {thematicsListData.map(thematicData => (
                <div key={thematicData.thematic.id} className={`${this.mainClass}__list-item`}>
                  <div className={`${this.mainClass}__list-item-title`}>{thematicData.thematic.name}</div>
                  <div className={`${this.mainClass}__list-sub-items`}>
                    {thematicData.fragments.map(fragment => (
                      <a
                        key={fragment.id}
                        href={fragment.url}
                        className={`${this.mainClass}__list-sub-item`}>
                        <div
                          style={{ backgroundImage: `url(https://assets-decodeurs.lemonde.fr/redacweb/5-2110-fragments-icono/${fragment.id}_thumb_hd.jpg)` }}
                          className={`${this.mainClass}__list-sub-item-image`} />
                        <div className={`${this.mainClass}__list-sub-item-texts`}>
                          <div className={`${this.mainClass}__list-sub-item-label`}>{fragment.main_region?.full_name}</div>
                          <div className={`${this.mainClass}__list-sub-item-title`}>{fragment.title}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export type { Props }
export default Menu