import { Component, VNode } from 'preact'
import styles from './styles.module.scss'

interface Props {
  legend?: string
  credits?: string
}

class ImageLegend extends Component<Props, {}> {
  render() {
    const { props } = this

    const wrapperClasses = [styles['wrapper']]
    const legendClasses = [styles['legend']]
    const creditsClasses = [styles['credits']]

    return (
      <p className={wrapperClasses.join(' ')}>
        {props.legend && <span className={legendClasses.join(' ')}>{props.legend}</span>}
        {props.credits && <span className={creditsClasses.join(' ')}> {props.credits}</span>}
      </p>
    )
  }
}

export type { Props }
export default ImageLegend
