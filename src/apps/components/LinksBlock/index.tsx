import { Component } from 'preact'
import bem from '../../../modules/utils/bem'
import { LinkData } from '../../types'
import Link from '../Link'
import plusAssetUrl from '../assets/plus.svg'
import arrowAssetUrl from '../assets/arrow.svg'
import Svg from '../../../modules/components/Svg'
import './styles.scss'
import Separator from '../Separator'

type Props = {
  links?: LinkData[]
}

type State = {
  isOpened?: boolean
}

export const className = bem('metoo-links-block')

export default class LinksBlock extends Component<Props, State> {
  state: State = { isOpened: false }

  constructor (props: Props) {
    super(props)
    this.toggleOpening = this.toggleOpening.bind(this)
  }

  toggleOpening () {
    this.setState(curr => ({
      ...curr,
      isOpened: !curr.isOpened
    }))
  }

  render () {
    const primaryLinks = this.props.links?.filter(linkData => linkData.is_primary)
    const secondaryLinks = this.props.links?.filter(linkData => !linkData.is_primary)

    return <div className={className.mod({ opened: this.state.isOpened }).value}>
      <div className={className.elt('primary-links').value}>
        {primaryLinks?.map(linkData => {
          return <div className={className.elt('primary-link').value}>
            <Link {...linkData} />
          </div>
        })}
      </div>
      <div className={className.elt('separator').value}><Separator /></div>
      <div className={className.elt('secondary-links').value}>
        <button
          className={className.elt('see-all').value}
          onClick={this.toggleOpening}>
          <Svg
            className={className.elt('see-all').elt('icon').value}
            src={this.state.isOpened ? arrowAssetUrl : plusAssetUrl} />
          <span className={className.elt('see-all').elt('label').value}>
            Tous les articles
          </span>
        </button>
        {this.state.isOpened && <div className={className.elt('secondary-links').value}>
          {secondaryLinks?.map(linkData => {
            return <div className={className.elt('secondary-link').value}>
              <Link {...linkData} />
            </div>
          })}
        </div>}
      </div>
    </div>
  }
}
