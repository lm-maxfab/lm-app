import { Component, JSX, VNode } from 'preact'
import bem from '../../utils/bem'
import Svg from '../Svg'
import logoUrl from './logo.svg'
import styles from './styles.module.scss'
import './styles.scss'

type NavItem = {
  value?: string|VNode
  status?: 'active'|'inactive'
}

type Props = {
  fill1?: string
  fill2?: string
  fillTransitionTime?: string
  navItems: NavItem[]
}

class ArticleHeader extends Component<Props, {}> {
  bemClss = bem('lm-article-header')

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props, bemClss } = this

    /* Classes and style */
    const wrapperClasses = [
      bemClss.value,
      styles['wrapper']
    ]
    const logoClasses = [
      bemClss.elt('logo').value,
      styles['logo']
    ]
    const navItemsClasses = [
      bemClss.elt('nav-items').value,
      styles['nav-items']
    ]
    const navItemsInnerClasses = [
      bemClss.elt('nav-items-inner').value,
      styles['nav-items-inner']
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
        <div className={navItemsClasses.join(' ')}>
          <div className={navItemsInnerClasses.join(' ')}>
            {props.navItems.map(navItem => {
              const { status } = navItem
              const navItemClasses = [
                bemClss
                  .elt('nav-item')
                  .mod({
                    'active': status === 'active',
                    'inactive': status === undefined || status === 'inactive'
                  })
                  .value,
                styles['nav-item']
              ]
              return <div className={navItemClasses.join(' ')}>
                {navItem.value}
              </div>
            })}
          </div>
        </div>
      </div>
    )
  }
}

export type { Props }
export default ArticleHeader
