import { Component, JSX } from 'preact'
import { SlideData } from '../../types'
import bem from '../../../modules/le-monde/utils/bem'
import './styles.scss'
import Img from '../../../modules/le-monde/components/Img'

interface Props {
  data?: SlideData
  imageLoading?: 'eager'|'lazy'
  className?: string
  style?: JSX.CSSProperties
}

class Slide extends Component<Props, {}> {
  clss = 'fraude-slide'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Logic */
    const data = props.data
    if (data === undefined) return null

    /* Assign classes */
    const classes = bem(props.className ?? '').block(this.clss)
    const inlineStyle: JSX.CSSProperties = { ...props.style }

    /* Display */
    return (
      <div className={classes.value} style={inlineStyle}>
        <div className={bem(this.clss).elt('inner').value}>
          {data.title !== undefined && <h1 className={bem(this.clss).elt('title').value}>{data.title}</h1>}
          {data.para_1 !== undefined && <p className={bem(this.clss).elt('para-1').value}>{data.para_1}</p>}
          {data.quote_1 !== undefined && <p className={bem(this.clss).elt('quote-1').value}>{data.quote_1}</p>}
          {data.para_2 !== undefined && <p className={bem(this.clss).elt('para-2').value}>{data.para_2}</p>}
          {data.quote_2 !== undefined && <p className={bem(this.clss).elt('quote-2').value}>{data.quote_2}</p>}
          {data.illus_url !== undefined && <Img
            src={data.illus_url}
            loading={props.imageLoading ?? 'lazy'}
            className={bem(this.clss).elt('illus').value} />}
        </div>
      </div>
    )
  }
}

export type { Props }
export default Slide
