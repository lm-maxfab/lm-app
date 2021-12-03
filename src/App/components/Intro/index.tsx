import { Component, JSX } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'
import { IntroElement } from '../../types'
import IntroParagraph from '../IntroParagraph'
import IntroImage from '../IntroImage'
import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  elements: IntroElement[]
}

class Intro extends Component<Props, {}> {
  clss: string = 'dest22-intro'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this
   
    /* Logic */
    const { elements } = props

    /* Classes & styles */
    const wrapperClasses = bem(props.className ?? '').block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    return (
      <div
        className={wrapperClasses.value}
        style={wrapperStyle}>
        <div
          className={bem(this.clss).elt('inner').value}>
          {elements.map(element => {
            console.log(element.type)
            if (element.type === 'texte') return <IntroParagraph content={element.content ?? <></>} />
            else if (element.type === 'image') return <IntroImage url={element.url ?? ''} />
            else return null
          })}
        </div>
      </div>
    )
  }
}

export type { Props }
export default Intro
