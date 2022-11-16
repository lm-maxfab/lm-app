import { Component } from 'preact'
import styles from './styles.module.scss'

type Props = {
  type?: 'module'|'html'
  content?: string
  status?: 'current'|'previous'|'inactive'
}
type State = {}

export default class BlockRenderer extends Component<Props, State> {
  render () {
    const { props } = this
    const wrapperClassName = [
      styles['wrapper'],
      styles[`${props.status ?? 'current'}`]
    ].join(' ')
    const content = props.content ?? ''
    switch (props.type) {
      case 'html':
      case undefined:
        return <div
          className={wrapperClassName}
          dangerouslySetInnerHTML={{ __html: content }} />
      case 'module':
        return <div
          className={wrapperClassName}>
          I cannot render modules yet.
        </div>
      default:
        return <div
          className={wrapperClassName}>
          Block type {props.type} is unknown
        </div>
    }
  }
}
