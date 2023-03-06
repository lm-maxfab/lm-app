import { Component, JSX } from 'preact'
import styles from './styles.module.scss'

interface Props {
  text: string
}

interface State { }

class scrollInfo extends Component<Props, State> {

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render(): JSX.Element {
    const { props } = this

    const scrollInfoClasses = [
      'lm-cover__scroll-info',
      styles['scroll-info']
    ]

    return <p className={scrollInfoClasses.join(' ')}>
      {props.text}
    </p>
  }
}

export type { Props, scrollInfo }
export default scrollInfo
