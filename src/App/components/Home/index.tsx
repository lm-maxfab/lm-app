import { Component, JSX } from 'preact'
import bem, { BEM } from '../../../modules/le-monde/utils/bem'
import './styles.scss'
import shape1 from './assets/shape-1.svg'
import Svg from '../../../modules/le-monde/components/Svg'
import Img from '../../../modules/le-monde/components/Img'

const imgUrl = 'https://img-19.ccm2.net/cI8qqj-finfDcmx6jMK6Vr-krEw=/1500x/smart/b829396acc244fd484c5ddcdcb2b08f3/ccmcms-commentcamarche/20494859.jpg'

interface Props {
  className?: string
  style?: JSX.CSSProperties
}

class Intro extends Component<Props, {}> {
  clss: string = 'dest22-home'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this
    const wrapperClasses = bem(props.className ?? '').block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }
    const titleClasses = bem(this.clss).elt('title')

    return (
      <div
        className={wrapperClasses.value}
        style={wrapperStyle}>
        <h1
          className={titleClasses.value}>
          <span>Coucou mon </span><Svg src={shape1} /><span> coco,
          voici un essai </span><Svg src={shape1} /><span> avec un SVG.</span>
        </h1>
        <div style={{
          backgroundImage: `url(${imgUrl})`,
          backgroundAttachment: 'fixed',
          position: 'absolute',
          top: '0px',
          left: '0px',
          height: '100%',
          width: '100%',
          objectFit: 'cover',
          mixBlendMode: 'darken'
        }} />
      </div>
    )
  }
}

export type { Props }
export default Intro
