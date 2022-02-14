import { Component, JSX } from 'preact'
import Sequencer from '../../../modules/le-monde/components/Sequencer'
import bem from '../../../modules/le-monde/utils/bem'
import Img from '../../../modules/le-monde/components/Img'
import { IntroImageData } from '../../types'

import './styles.scss'
import arrayRandomPick from '../../../modules/le-monde/utils/array-random-pick'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  images?: IntroImageData[]
}

interface State {
  active_left: any
  active_right: any
  active_mobile: any
}

class ImageFlipper extends Component<Props, State> {
  static clss = 'covid-image-flipper'
  clss = ImageFlipper.clss
  state: State = {
    active_left: null,
    active_right: null,
    active_mobile: null
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props, state } = this

    /* Classes and style */
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }
    
    const leftList = (props.images ?? []).filter((_image, pos) => pos % 2)
    const rightList = (props.images ?? []).filter((_image, pos) => (pos + 1) % 2)

    /* Display */
    return (
      <div className={wrapperClasses.value} style={wrapperStyle}>
        <Sequencer
          play
          tempo={60}
          sequence={['left', 'right']}
          length={(leftList?.length ?? 0) * 2}
          onStepChange={({ value }) => {
            // console.log('step change')
            const shouldLeftChange = value === 'left'
            const shouldRightChange = value === 'right'
            this.setState(currState => {
              console.log('shouldLeftChange', shouldLeftChange)
              console.log('currState.active_left?.id', currState.active_left?.id)
              console.log('leftList.includes(currState.active_left)', leftList.includes(currState.active_left))

              console.log('shouldRightChange', shouldRightChange)
              console.log('currState.active_right?.id', currState.active_right?.id)
              console.log('rightList.includes(currState.active_right)', rightList.includes(currState.active_right))

              return {
                ...currState,
                active_left: shouldLeftChange
                  ? arrayRandomPick(leftList, [currState.active_left])
                  : currState.active_left,
                active_right: shouldRightChange
                  ? arrayRandomPick(rightList, [currState.active_right])
                  : currState.active_right
              }
            })
          }}
          renderer={() => {
            return <>
              <div className={bem(this.clss).elt('left').value}>
                {leftList.map((imgData, imgDataPos) => {
                  const imageClass = imgData === state.active_left ? 'active' : 'inactive'
                  return <Img className={imageClass} src={imgData.url} />
                })}
              </div>
              <div className={bem(this.clss).elt('right').value}>
                {rightList.map((imgData, imgDataPos) => {
                  const imageClass = imgData === state.active_right ? 'active' : 'inactive'
                  return <Img className={imageClass} src={imgData.url} />
                })}
              </div>
            </>
          }} />
        <Sequencer
          play
          tempo={64}
          renderer={({ step, value }) => {
            return <div className={bem(this.clss).elt('mobile').value}>
              {(props.images ?? []).map((imgData, imgDataPos) => {
                return <Img src={imgData.url} />
              })}
            </div>
          }} />
      </div>
    )
  }
}

export type { Props }
export default ImageFlipper
