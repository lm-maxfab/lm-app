import { Component, JSX } from 'preact'
import { SlideData } from '../../types'
import bem from '../../../modules/le-monde/utils/bem'
import './styles.scss'
import Img from '../../../modules/le-monde/components/Img'
import StrToHtml from '../../../modules/le-monde/components/StrToHtml'

interface Props {
  data?: SlideData
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
    const classes = bem(props.className ?? '').block(this.clss)
    const inlineStyle: JSX.CSSProperties = {
      ...props.style,
    }

    const backgroundStyle: JSX.CSSProperties = {
      backgroundImage: data.illus_background ? `url(${data.illus_url})` : '',
      maskImage: data.illus_mask ? `url(${data.illus_mask})` : '',
      webkitMaskImage: data.illus_mask ? `url(${data.illus_mask})` : '',
    }

    /* Display */
    return (
      <div className={classes.value} style={inlineStyle}>

        {data.illus_background && <div 
          className={bem(this.clss).elt('background').mod({ mask: data.illus_mask !== undefined }).value} 
          style={backgroundStyle}>
        </div>}

        <div className={bem(this.clss).elt('inner').mod({ background: data.illus_background !== undefined && !data.illus_mask }).value}>
          {data.illus_url !== undefined && !data.illus_background && <Img
            src={data.illus_url}
            alt={data.illus_alt ?? ''}
            loading={props.imageLoading ?? 'lazy'}
            className={bem(this.clss).elt('illus').mod({ bottom: data.illus_bottom !== undefined }).value} />}

          <div className={bem(this.clss).elt('text').value}>
            {data.label !== undefined && <p className={bem(this.clss).elt('label').value}>{data.label}</p>}
            {data.title !== undefined && <p className={bem(this.clss).elt('title').value}>
              <StrToHtml wrapperTag='span' content={data.title} />
            </p>}
            {data.para_1 !== undefined && <p className={bem(this.clss).elt('para-1').value}>{data.para_1}</p>}
          </div>

          {data.title_bottom !== undefined && <p className={bem(this.clss).elt('title').mod('bottom').value}>
            <StrToHtml wrapperTag='span' content={data.title_bottom} />
          </p>}
        </div>
      </div>
    )
  }
}

export type { Props }
export default Slide
