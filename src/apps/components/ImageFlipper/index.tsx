import { Component, JSX } from 'preact'
import Sequencer from '../../../modules/le-monde/components/Sequencer'
import bem from '../../../modules/le-monde/utils/bem'
import Img from '../../../modules/le-monde/components/Img'
import { IntroImageData } from '../../types'

import './styles.scss'
import absoluteModulo from '../../../modules/le-monde/utils/absolute-modulo'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  images?: IntroImageData[]
}

interface State {
  step: number
}

class ImageFlipper extends Component<Props, State> {
  static clss = 'covid-image-flipper'
  clss = ImageFlipper.clss
  state: State = { step: 0 }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props, state } = this

    /* Classes and style */
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }
    
    /* Display */
    return (
      <div
        style={wrapperStyle}
        className={wrapperClasses.value}>
        <Sequencer
          play
          tempo={80}
          onStepChange={() => {
            if (Math.random() < (2 / 3)) {
              this.setState(curr => ({
                ...curr,
                step: curr.step + 1
              }))
            }
          }}
          renderer={() => {
            const { step } = state
            const sequenceLength = (props.images ?? []).length
            const leftNb = Math.floor(step / 2) * 2 + 1
            const rightNb = (Math.floor((step + 1) / 2) * 2)

            const leftPos = absoluteModulo(leftNb, sequenceLength)
            const rightPos = absoluteModulo(rightNb, sequenceLength)
            const mobilePos = absoluteModulo(step, sequenceLength)

            const pLeftPos = absoluteModulo((leftPos - 2), sequenceLength)
            const pRightPos = absoluteModulo((rightPos - 2), sequenceLength)
            const pMobilePos = absoluteModulo(mobilePos - 1, sequenceLength)

            const nLeftPos = absoluteModulo((leftPos + 2), sequenceLength)
            const nRightPos = absoluteModulo((rightPos + 2), sequenceLength)
            const nMobilePos = absoluteModulo(mobilePos + 1, sequenceLength)
            return <>
              <div className={bem(this.clss).elt('left').value}>
                {props.images?.map((imgData, imgPos) => {
                  const isActive = imgPos === leftPos
                  const isPrev = imgPos === pLeftPos
                  const isNext = imgPos === nLeftPos
                  const imgClass = bem(this.clss).elt('image').mod({
                    active: isActive,
                    previous: isPrev
                  })
                  return <Img
                    loading={isActive || isNext ? 'eager' : 'lazy'}
                    src={imgData.url}
                    className={imgClass.value} />
                })}
              </div>
              <div className={bem(this.clss).elt('right').value}>
                {props.images?.map((imgData, imgPos) => {
                  const isActive = imgPos === rightPos
                  const isPrev = imgPos === pRightPos
                  const isNext = imgPos === nRightPos
                  const imgClass = bem(this.clss).elt('image').mod({
                    active: isActive,
                    previous: isPrev
                  })
                  return <Img
                    loading={isActive || isNext ? 'eager' : 'lazy'}
                    src={imgData.url}
                    className={imgClass.value} />
                })}
              </div>
              <div className={bem(this.clss).elt('mobile').value}>
                {props.images?.map((imgData, imgPos) => {
                  const isActive = imgPos === mobilePos
                  const isPrev = imgPos === pMobilePos
                  const isNext = imgPos === nMobilePos
                  const imgClass = bem(this.clss).elt('image').mod({
                    active: isActive,
                    previous: isPrev
                  })
                  return <Img
                    loading={isActive || isNext ? 'eager' : 'lazy'}
                    src={imgData.url}
                    className={imgClass.value} />
                })}
              </div>
            </>
          }} />
      </div>
    )
  }
}

export type { Props }
export default ImageFlipper
