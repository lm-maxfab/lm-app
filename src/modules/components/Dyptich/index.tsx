import { Component } from 'preact'
import BlocksFader from '../BlocksFader'
import MediaDescription from '../MediaDescription'
import Sequencer from '../Sequencer'
import './styles.scss'

type Props = {
  leftImagesUrls?: string|string[]
  rightImagesUrls?: string|string[]
  mobileBehavior?: 'keep'|'stack'|'merge'
  mergeOrder?: 'alternate'|'follow'
}

export default class Dyptich extends Component<Props, {}> {
  render () {
    const { props } = this
    const {
      leftImagesUrls,
      rightImagesUrls,
      mobileBehavior = 'stack',
      mergeOrder = 'alternate'
    } = props
    const leftUrls = leftImagesUrls === undefined ? [] : (Array.isArray(leftImagesUrls) ? leftImagesUrls : [leftImagesUrls])
    const rightUrls = rightImagesUrls === undefined ? [] : (Array.isArray(rightImagesUrls) ? rightImagesUrls : [rightImagesUrls])
    const mergedUrls: string[] = []
    if (mergeOrder === 'alternate') {
      const longestListLength = Math.max(leftUrls.length, rightUrls.length)
      new Array(longestListLength).fill(null).map((e, i) => {
        const leftUrl = leftUrls[i]
        const rightUrl = rightUrls[i]
        if (leftUrl !== undefined) mergedUrls.push(leftUrl)
        if (rightUrl !== undefined) mergedUrls.push(rightUrl)
      })
    } else mergedUrls.push(...leftUrls, ...rightUrls)

    return <div className='lm-dyptich'>
      <div className='lm-dyptich__separated-slot'>
        <div className='lm-dyptich__left-slot'>
          <Sequencer
            play
            tempo={10}
            sequence={leftUrls}
            renderer={({ step }) => {
              const blocks = leftUrls.map(url => ({ content: <img src={url} /> }))
              return <BlocksFader
                blocks={blocks}
                current={step} />
            }} />
        </div>
        <div className='lm-dyptich__right-slot'>
          {/* <Sequencer
            play
            sequence={rightUrls}
            renderer={rendererArgs => {
              return rightUrls.map(url => <img
                src={url}
                style={{ display: url === rendererArgs.value ? 'block' : 'none' }} />)
            }} /> */}
        </div>
      </div>
      <div className='lm-dyptich__merged-slot'>
        {/* <Sequencer
          play
          sequence={mergedUrls}
          renderer={rendererArgs => {
            return mergedUrls.map(url => <img
              src={url}
              style={{ display: url === rendererArgs.value ? 'block' : 'none' }} />)
          }} /> */}
      </div>
    </div>
  }
}
