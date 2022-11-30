import { Component, JSX } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'
import { IntroParagraphData } from '../../types'
import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  paragraphs?: IntroParagraphData[]
}

class Intro extends Component<Props, {}> {
  clss = 'photos22-intro'

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
        <div className={bem(this.clss).elt('inner').value}>
          {props.paragraphs?.map(paragraph => <p>{paragraph.content}</p>)}
        </div>
      </div>
    )
  }
}

export type { Props }
export default Intro
