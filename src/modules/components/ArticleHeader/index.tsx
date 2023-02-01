import { Component, JSX, VNode } from 'preact'
import bem from '../../utils/bem'
import Svg from '../Svg'
import logoUrl from './logo.svg'
import styles from './styles.module.scss'
import './styles.scss'

type NavItem = {
  value?: string
  isActive?: boolean
}

type Props = {
  fill1?: string
  fill2?: string
  fillTransitionTime?: string
  navItems: NavItem[]
  ctaContent?: string|VNode
  hideLogo?: boolean
  hideNav?: boolean
  hideCta?: boolean
}

class ArticleHeader extends Component<Props> {
  bemClss = bem('lm-article-header')

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props, bemClss } = this

    /* Classes and style */
    const wrapperClasses = [
      bemClss.mod({
        'hide-logo': props.hideLogo === true,
        'hide-nav': props.hideNav === true,
        'hide-cta': props.hideCta === true
      }).value,
      styles['wrapper']
    ]
    if (props.hideLogo === true) wrapperClasses.push(styles['wrapper_hide-logo'])
    if (props.hideNav === true) wrapperClasses.push(styles['wrapper_hide-nav'])
    if (props.hideCta === true) wrapperClasses.push(styles['wrapper_hide-cta'])
    const logoClasses = [
      bemClss.elt('logo').value,
      styles['logo']
    ]
    const navClasses = [
      bemClss.elt('nav').value,
      styles['nav']
    ]
    const ctaWrapperClasses = [
      bemClss.elt('cta-wrapper').value,
      styles['cta-wrapper']
    ]
    // [WIP] Make a standalone Logo component, fill-1 and fill-2
    // dont belong here
    const logoStyle: JSX.CSSProperties = {
      '--fill-1': props.fill1 ?? '#FFFFFF',
      '--fill-2': props.fill2 ?? 'rgb(255, 255, 255, .6)',
      '--fill-transition-time': props.fillTransitionTime ?? '600ms'
    }

    /* Display */
    return (
      <div className={wrapperClasses.join(' ')}>
        <a href='https://lemonde.fr'>
          <Svg
            src={logoUrl}
            style={logoStyle}
            className={logoClasses.join(' ')} />
        </a>
        {props.navItems.length > 0 && <div className={navClasses.join(' ')}>
          {props.navItems.map(navItem => {
            const { isActive } = navItem
            const navItemBemClss = bemClss.elt('nav-item').mod({ 'active': isActive })
            const navItemClasses = [navItemBemClss.value, styles['nav-item']]
            if (isActive) navItemClasses.push(styles['nav-item_active'])
            return <div
              className={navItemClasses.join(' ')}>
              {navItem.value}
            </div>
          })}
        </div>}
        {props.ctaContent !== undefined && <div
          className={ctaWrapperClasses.join(' ')}>
          {props.ctaContent}
        </div>}
      </div>
    )
  }
}

export type { Props, NavItem }
export default ArticleHeader
