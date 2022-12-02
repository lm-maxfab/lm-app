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
  clss = 'photos22-home'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Logic */
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

              const dateRegex = /\d{4}\/\d{2}\/\d{2}/i
              const imageDate = (imageUrl ?? '').match(dateRegex) ? imageUrl.match(dateRegex)![0] : ''
              const imageName = (imageUrl ?? '').substring(imageUrl.lastIndexOf('/') + 1, imageUrl.lastIndexOf('.'))
              const imageExt = (imageUrl ?? '').substring(imageUrl.lastIndexOf('.') + 1)

              const widths = [800, 1000, 1400, 2200]
              const srcSet = widths.map(width => {
                  const targetFileName = `https://img.lemde.fr/${imageDate}/0/0/0/0/${width}/0/0/0/${imageName}.${imageExt}`
                  const targetWidthName = `${Math.floor(width / 1.2)}w`
                  return `${targetFileName} ${targetWidthName}`
                }).join(', ')

              const isPassed = imagePos < step
              const isCurrent = imagePos === step
              const isNext = imagePos === (step + 1) % imagesSequence.length
              const isToCome = imagePos > step

              const classes = bem(this.clss).elt('image').mod({
                passed: isPassed,
                current: isCurrent,
                ['to-come']: isToCome
              })

              return <Img
                loading={isPassed || isCurrent || isNext ? 'eager' : 'lazy'}
                src={imageUrl}
                className={classes.value}
                srcSet={srcSet} />
            })
          }} />

          <h1 className={bem(this.clss).elt('title').value}>
            <span className={bem(this.clss).elt('title-line-1').value}>2022</span>
            <span className={bem(this.clss).elt('title-line-2').value}>Une année en photo</span>
            <span className={bem(this.clss).elt('title-line-3').value}>#PourLeMonde</span>
            <span className={bem(this.clss).elt('chevron').value}><Svg src={chevronUrl} /></span>
          </h1>
      </div>
    )
  }
}

export type { Props }
export default Home
