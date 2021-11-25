import { Component, JSX } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'
import { HomeImageData } from '../../types'
import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  images?: HomeImageData[]
}

class Home extends Component<Props, {}> {
  clss = 'photos21-home'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Classes and style */
    const classes = bem(props.className ?? '').block(this.clss)
    const inlineStyle: JSX.CSSProperties = { ...props.style }

    /* Display */
    return (
      <div className={classes.value} style={inlineStyle}>
        Home images.
      </div>
    )
  }
}

export type { Props }
export default Home
