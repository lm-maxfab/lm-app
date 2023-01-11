import { Component, VNode } from 'preact'
import SmallArrow from '../SmallArrow'
import styles from './styles.module.scss'

type Props = {
  text?: VNode | string,
  url?: string,
}

type State = {
}

export default class Episode extends Component<Props, State> {
  render() {
    const { url, text } = this.props

    return <div className={styles['cta']}>
      <a href={url}>
        <span>{text}<SmallArrow /></span>
      </a>
    </div>
  }
}
