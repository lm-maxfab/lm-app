import { Component, JSX } from 'preact'
import Img from '../../../modules/le-monde/components/Img'
import Sequencer from '../../../modules/le-monde/components/Sequencer'
import Svg from '../../../modules/le-monde/components/Svg'
import bem from '../../../modules/le-monde/utils/bem'
import { HomeImageData } from '../../types'
import chevronUrl from './assets/chevron.svg'
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

    /*  */
    const imagesSequence = (props.images ?? [])
      .map(imageData => imageData.url)
      .filter(url => typeof url === 'string' && url !== '') as string[]

    /* Classes and style */
    const classes = bem(props.className ?? '').block(this.clss)
    const inlineStyle: JSX.CSSProperties = { ...props.style }

    /* Display */
    return (
      <div className={classes.value} style={inlineStyle}>
        <Sequencer
          play={true}
          tempo={12}
          sequence={imagesSequence}
          renderer={({ step }) => {
            return imagesSequence.map((imageUrl, imagePos) => {
              const widths = [740, 1000, 1500, 2000]
              const imageName = (imageUrl ?? '').split('.').slice(0, -1).join('.')
              const imageExt = (imageUrl ?? '').replace(new RegExp(`^${imageName}.`, 'gm'), '')
              const srcSet = widths.map(width => {
                const targetFileName = `${imageName}.${width}.q40.comp.${imageExt}`
                const targetWidthName = `${width}w`
                return `${targetFileName} ${targetWidthName}`
              }).join(', ')
              const classes = bem(this.clss).elt('image').mod({
                passed: imagePos < step,
                current: imagePos === step,
                ['to-come']: imagePos > step
              })
              return <Img
                src={imageUrl}
                className={classes.value}
                srcSet={srcSet} />
            })
          }} />
          <h1 className={bem(this.clss).elt('title').value}>
            <span className={bem(this.clss).elt('title-line-1').value}>2021</span>
            <span className={bem(this.clss).elt('title-line-2').value}>Une année en photo</span>
            <span className={bem(this.clss).elt('chevron').value}><Svg src={chevronUrl} /></span>
          </h1>
      </div>
    )
  }
}

export type { Props }
export default Home
