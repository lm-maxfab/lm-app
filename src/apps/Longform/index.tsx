import { Component, JSX } from 'preact'
import Scrollgneugneu, { PropsPageData, PropsBlockData } from '../../modules/layouts/Scrollgneugneu'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import './styles.scss'

import {
  GeneralSettings,
  BlockData as BlockDataFromSheet,
  PageData as PageDataFromSheet
} from '../types'

interface Props extends InjectedProps {}
interface State {}

class Longform extends Component<Props, State> {
  static clss: string = 'sable-longform'
  clss = Longform.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this
    const { sheetBase } = props

    //   const pagesData: PropsPageData[] = [{
    //     bgColor: 'blue',
    //     blocks: [{
    //       id: 'first-scroll-block',
    //       depth: 'scroll',
    //       zIndex: 3,
    //       type: 'html',
    //       content: '<div style="height: 2000px; background-color: violet;">I am the first scroll content</div>',
    //       layout: 'left-half',
    //       mobileLayout: 'right-half',
    //       transitions: [['whirl', 600]],
    //       mobileTransitions: [['grow', 600]]
    //     }, {
    //       id: 'first-back-block',
    //       depth: 'back',
    //       zIndex: 0,
    //       type: 'module',
    //       content: 'http://localhost:50003/module-1/index.js',
    //       layout: 'right-half',
    //       mobileLayout: 'left-half',
    //       trackScroll: true
    //     }]
    //   }, {
    //     bgColor: 'red',
    //     blocks: [{
    //       // id: 'second-scroll-block',
    //       depth: 'scroll',
    //       zIndex: 3,
    //       type: 'html',
    //       content: '<div style="height: 2000px; background-color: chocolate;">I am the second scroll content</div>',
    //       layout: 'left-half',
    //       mobileLayout: 'right-half',
    //       transitions: [['whirl', 600]],
    //       mobileTransitions: [['grow', 600]],
    //       trackScroll: false
    //     }, {
    //       id: 'first-back-block'
    //     }, {
    //       id: 'second-back-block',
    //       type: 'html',
    //       depth: 'back',
    //       layout: 'right-half',
    //       content: '<div>I am the second back block</div>',
    //       trackScroll: true
    //     }]
    //   },
    //   {},
    //   { blocks: [{id: 'first-scroll-block' }, {id: 'first-back-block' }, {id: 'second-back-block' }] },
    //   { blocks: [{id: 'first-scroll-block' }, {id: 'first-back-block' }] },
    //   { blocks: [{id: 'first-scroll-block' }, {id: 'first-back-block' }, {id: 'second-back-block' }] },
    //   {},
    //   {},
    //   { blocks: [{id: 'first-scroll-block' }, {id: 'first-back-block' }, {id: 'second-back-block' }] },
    //   { blocks: [{id: 'first-scroll-block' }, {id: 'first-back-block' }, {id: 'second-back-block' }] }
    // ]

    const generalSettings = sheetBase?.collection('general_settings').entries[0].value as GeneralSettings|undefined
    const blocksData = sheetBase?.collection('blocks_data').value as BlockDataFromSheet[]|undefined
    // const rawPagesData = sheetBase?.collection('pages_data').value as PageDataFromSheet[]|undefined
    // const pagesData: PropsPageData[]|undefined = rawPagesData?.map(rawPageData => {
    //   const fixedBlocksData: PropsBlockData[] = []
    //   rawPageData.blocks_ids?.split(',').map(name => {
    //     const blockId = name.trim()
    //     const theActualBlock = blocksData?.find(blockData => blockData.id === blockId)
    //     if (theActualBlock !== undefined) {
    //       const extractedBlockData: PropsBlockData = {
    //         id: theActualBlock.id as PropsBlockData['id'],
    //         depth: (theActualBlock.depth ?? 'back') as PropsBlockData['depth'],
    //         type: theActualBlock.type as PropsBlockData['type'],
    //         content: theActualBlock.content as PropsBlockData['content'],
    //         layout: theActualBlock.layout as PropsBlockData['layout'],
    //         mobileLayout: theActualBlock.mobileLayout as PropsBlockData['mobileLayout'],
    //         transitions: theActualBlock.transitions
    //           ?.split(';')
    //           .map(str => str
    //             .trim()
    //             .split(',')
    //             .map(str => str.trim())
    //             .map((val, pos) => {
    //               if (pos === 0) return val
    //               if (pos === 1 && val === undefined) return '600ms'
    //               if (val.match(/[0-9]$/gm)) return `${val}ms`
    //               return val
    //             })
    //           ) as PropsBlockData['transitions'],
    //         mobileTransitions: theActualBlock.mobileTransitions
    //           ?.split(';')
    //           .map(str => str
    //             .trim()
    //             .split(',')
    //             .map(str => str.trim())
    //             .map((val, pos) => {
    //               if (pos === 0) return val
    //               if (pos === 1 && val === undefined) return '600ms'
    //               if (val.match(/[0-9]$/gm)) return `${val}ms`
    //               return val
    //             })
    //           ) as PropsBlockData['mobileTransitions'],
    //         zIndex: theActualBlock.zIndex,
    //         trackScroll: theActualBlock.trackScroll
    //       }
    //       fixedBlocksData.push(extractedBlockData)
    //     }
    //   })
    //   return {
    //     bgColor: rawPageData.bg_color,
    //     blocks: [{
    //       depth: 'scroll',
    //       type: 'html',
    //       content: rawPageData.content,
    //       layout: rawPageData.layout as PropsBlockData['layout'],
    //       mobileLayout: rawPageData.mobileLayout as PropsBlockData['mobileLayout']
    //     }, ...fixedBlocksData]
    //   }
    // })

    const pagesData: PropsPageData[] = [{
      blocks: [{
        depth: 'front',
        type: 'html',
        content: '<div style="width: unset; background-color: blue; height: unset;">BACK</div>',
        layout: 'right-half-bottom'
      }, {
        depth: 'scroll',
        type: 'html',
        content: '<div style="height: 3000px; background-color: rgb(255, 127, 80, .2);">SCROLL</div>',
        layout: 'left-half'
      }]
    }]

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      <Scrollgneugneu
        pages={pagesData}
        thresholdOffset={generalSettings?.threshold_offset}
        bgColorTransitionDuration={generalSettings?.bg_color_transition_duration} />
    </div>
  }
}

export type { Props, Longform }
export default appWrapper(Longform)
