import { Component } from 'preact'
import bem from '../../../modules/utils/bem'
import './styles.scss'

import getConfig from '../../../modules/utils/get-config'

const config = getConfig()

type Props = {
  iso?: string
}

type State = {
}

export const className = bem('mondial-flag')

export default class Flag extends Component<Props, State> {
  render() {
    // const imgSrc = `${config?.assets_root_url}/flag-${this.props.iso}.svg`
    const imgSrc = `${config?.assets_root_url}/flag-eng.svg`

    return <div className={className.value}>
      <img src={imgSrc}></img>
    </div>
  }
}
