import { Component, JSX } from 'preact'
import { IntroSlideData } from '../../types'
import bem from '../../../modules/le-monde/utils/bem'
import './styles.scss'
import Img from '../../../modules/le-monde/components/Img'
import StrToHtml from '../../../modules/le-monde/components/StrToHtml'

interface Props {
  data?: IntroSlideData
  imageLoading?: 'eager' | 'lazy'
  className?: string
  style?: JSX.CSSProperties
}

class Slide extends Component<Props, {}> {
  clss = 'fraude-slide'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render(): JSX.Element | null {
    const { props } = this

    /* Logic */
    const data = props.data
    if (data === undefined) return null

    /* Assign classes */
    const inlineStyle: JSX.CSSProperties = {
      ...props.style,
    }

    /* Display */
    return (
      <div className={bem(this.clss).mod('intro').value} style={inlineStyle}>
        <div className={bem(this.clss).elt('inner').value}>
          {data.date !== undefined && <p className={bem(this.clss).elt('date').value}>{data.date}</p>}

          <div className={bem(this.clss).elt('header').value}>
            {data.title !== undefined && <p className={bem(this.clss).elt('main-title').value}>{data.title}</p>}
            {data.credits !== undefined && <p className={bem(this.clss).elt('credits').value}>{data.credits}</p>}
          </div>

          {data.intro !== undefined && <p className={bem(this.clss).elt('intro-text').value}>{data.intro}</p>}

          <div className={bem(this.clss).elt('cta-block').value}>
            {data.illus_cover !== undefined && <Img
              src={data.illus_cover}
              loading={props.imageLoading ?? 'lazy'}
              className={bem(this.clss).elt('illus-cover').value} />}
            {data.cta !== undefined && <p className={bem(this.clss).elt('cta').value}>{data.cta}</p>}
          </div>
        </div>
      </div>
    )
  }
}

export type { Props }
export default Slide
