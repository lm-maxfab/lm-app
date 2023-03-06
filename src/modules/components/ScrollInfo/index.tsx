import { Component, JSX } from 'preact'
import styles from './styles.module.scss'

import SmallArrow from '../SmallArrow'

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

    return <div className={scrollInfoClasses.join(' ')}>
      <SmallArrow />
      <p>{props.text}</p>
    </div>
  }
}

export type { Props, scrollInfo }
export default scrollInfo
