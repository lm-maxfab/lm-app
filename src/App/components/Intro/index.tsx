import { Component, JSX } from 'preact'
<<<<<<< HEAD
import bem, { BEM } from '../../../modules/le-monde/utils/bem'
import './styles.scss'
import shape1 from './assets/shape-1.svg'
import Svg from '../../../modules/le-monde/components/Svg'
import Img from '../../../modules/le-monde/components/Img'

const imgUrl = 'https://img-19.ccm2.net/cI8qqj-finfDcmx6jMK6Vr-krEw=/1500x/smart/b829396acc244fd484c5ddcdcb2b08f3/ccmcms-commentcamarche/20494859.jpg'
=======
import bem from '../../../modules/le-monde/utils/bem'
import { IntroParagraphData } from '../../types'
import './styles.scss'
>>>>>>> master

interface Props {
  className?: string
  style?: JSX.CSSProperties
<<<<<<< HEAD
}

class Intro extends Component<Props, {}> {
  bem: BEM = bem('dest22-intro')
=======
  paragraphs?: IntroParagraphData[]
}

class Intro extends Component<Props, {}> {
  clss = 'photos21-intro'
>>>>>>> master

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
<<<<<<< HEAD
  render (): JSX.Element {
    const { props } = this
    const classes = this.bem.block(props.className)
    const inlineStyle: JSX.CSSProperties = { ...props.style }

    return (
      <div
        className={classes.value}
        style={inlineStyle}>
        <h1 className={this.bem.elt('title').value} style={{ paddingTop: '500px' }}>
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
=======
  render (): JSX.Element|null {
    const { props } = this

    /* Classes and style */
    const classes = bem(props.className ?? '').block(this.clss)
    const inlineStyle: JSX.CSSProperties = { ...props.style }

    /* Display */
    return (
      <div className={classes.value} style={inlineStyle}>
        <div className={bem(this.clss).elt('inner').value}>
          {props.paragraphs?.map(paragraph => paragraph.content)}
        </div>
>>>>>>> master
      </div>
    )
  }
}

export type { Props }
export default Intro
