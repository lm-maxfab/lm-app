import { Component, JSX } from 'preact'
import Scrollgneugneu, {
  BlockDataCommonProperties,
  BlockDataFixed,
  BlockDataLayoutName,
  BlockDataType,
  PageData
} from '../../modules/layouts/Scrollgneugneu'
import { TransitionDescriptor } from '../../modules/layouts/Scrollgneugneu/TransitionsWrapper'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import {
  GeneralSettings,
  BlockData as BlockDataFromSheet,
  PageData as PageDataFromSheet
} from '../types'
import './styles.scss'

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
    const generalSettings = sheetBase?.collection('general_settings').entries[0].value as GeneralSettings|undefined
    const blocksData = sheetBase?.collection('blocks_data').value as BlockDataFromSheet[]|undefined
    // const pagesData: PageData[] = [{
    //   bgColor: 'blue',
    //   blocks: [{
    //     depth: 'scroll',
    //     type: 'html',
    //     content: `<div style="height: 2000px"></div>`,
    //     layout: 'left-half'
    //   }, {
    //     depth: 'front',
    //     type: 'html',
    //     content: `<div>I am a front module</div>`,
    //     layout: 'right-half'
    //   }]
    // }, {
    //   bgColor: 'orange',
    //   blocks: [{
    //     depth: 'scroll',
    //     type: 'html',
    //     content: `<div style="height: 2000px"></div>`,
    //     layout: 'left-half'
    //   }, {
    //     depth: 'front',
    //     type: 'module',
    //     content: 'http://localhost:50003/module-1/index.js',
    //     layout: 'right-half',
    //     trackScroll: true
    //   }]
    // }, {
    //   bgColor: 'green',
    //   blocks: [{
    //     depth: 'scroll',
    //     type: 'html',
    //     content: `<div style="height: 2000px"></div>`,
    //     layout: 'left-half'
    //   }, {
    //     depth: 'front',
    //     type: 'module',
    //     content: 'http://localhost:50003/module-example/index.js',
    //     layout: 'right-half',
    //     trackScroll: true
    //   }]
    // }]
    const rawPagesData = sheetBase?.collection('pages_data').value as PageDataFromSheet[]|undefined
    const pagesData: PageData[]|undefined = rawPagesData?.map(rawPageData => {
      const fixedBlocksData: BlockDataFixed[] = []
      rawPageData.blocks_ids?.split(',').map(name => {
        const blockId = name.trim()
        const theActualBlock = blocksData?.find(blockData => blockData.id === blockId)
        if (theActualBlock !== undefined) {
          const extractedBlockData: BlockDataFixed = {
            id: theActualBlock.id as string|undefined,
            depth: (theActualBlock.depth ?? 'back') as 'front'|'back',
            type: theActualBlock.type as BlockDataType|undefined,
            content: theActualBlock.content as BlockDataCommonProperties['content']|undefined,
            layout: theActualBlock.layout as BlockDataLayoutName|undefined,
            mobileLayout: theActualBlock.mobileLayout as BlockDataLayoutName|undefined,
            transitions: theActualBlock.transitions
              ?.split(';')
              .map(str => str
                .trim()
                .split(',')
                .map(str => str.trim())
                .map((val, pos) => {
                  if (pos === 0) return val
                  if (pos === 1 && val === undefined) return '600ms'
                  if (val.match(/[0-9]$/gm)) return `${val}ms`
                  return val
                })
              ) as TransitionDescriptor[]|undefined,
            mobileTransitions: theActualBlock.mobileTransitions
              ?.split(';')
              .map(str => str
                .trim()
                .split(',')
                .map(str => str.trim())
                .map((val, pos) => {
                  if (pos === 0) return val
                  if (pos === 1 && val === undefined) return '600ms'
                  if (val.match(/[0-9]$/gm)) return `${val}ms`
                  return val
                })
              ) as TransitionDescriptor[]|undefined,
            zIndex: theActualBlock.zIndex,
            trackScroll: theActualBlock.trackScroll
          }
          fixedBlocksData.push(extractedBlockData)
        }
      })
      return {
        bgColor: rawPageData.bg_color,
        blocks: [{
          depth: 'scroll',
          type: 'html',
          content: rawPageData.content,
          layout: rawPageData.layout as BlockDataLayoutName|undefined,
          mobileLayout: rawPageData.mobileLayout as BlockDataLayoutName|undefined
        }, ...fixedBlocksData]
      }
    })

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
