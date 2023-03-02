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
import Sequencer from '../../modules/components/Sequencer'
import TextSequencer from '../../modules/components/TextSequencer'
import MessagesSequencer from '../../modules/components/MessagesSequencer'

interface Props extends InjectedProps { }
interface State { }

export default function LongformOf(slotName: string) {
  return appWrapper(class Longform extends Component<Props, State> {
    static clss: string = 'pedocrim-longform'
    clss = Longform.clss

    /* * * * * * * * * * * * * * *
     * RENDER
     * * * * * * * * * * * * * * */
    render(): JSX.Element {
      const { props } = this
      const { sheetBase } = props

      const generalSettings = sheetBase?.collection('general_settings').entries[0].value as GeneralSettings | undefined
      const blocksData = sheetBase?.collection('blocks_data').value as BlockDataFromSheet[] | undefined
      const rawPagesData = sheetBase?.collection('pages_data').value as PageDataFromSheet[] | undefined
      const pagesData: PropsPageData[] | undefined = rawPagesData
        ?.filter(rawPageData => rawPageData.page_destination === slotName)
        .map(rawPageData => {
          const fixedBlocksData: PropsBlockData[] = []
          rawPageData.blocks_ids?.split(',').map(name => {
            const blockId = name.trim()
            const theActualBlock = blocksData?.find(blockData => blockData.id === blockId)
            if (theActualBlock !== undefined) {
              const extractedBlockData: PropsBlockData = {
                id: theActualBlock.id as PropsBlockData['id'],
                depth: (theActualBlock.depth ?? 'back') as PropsBlockData['depth'],
                type: theActualBlock.type as PropsBlockData['type'],
                content: theActualBlock.content as PropsBlockData['content'],
                layout: theActualBlock.layout as PropsBlockData['layout'],
                mobileLayout: theActualBlock.mobileLayout as PropsBlockData['mobileLayout'],
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
                  ) as PropsBlockData['transitions'],
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
                  ) as PropsBlockData['mobileTransitions'],
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
              layout: rawPageData.layout as PropsBlockData['layout'],
              mobileLayout: rawPageData.mobileLayout as PropsBlockData['mobileLayout']
            }, ...fixedBlocksData]
          }
        })

      if (pagesData === undefined || pagesData.length === 0) return <></>

      // Assign classes and styles
      const wrapperClasses = bem(props.className).block(this.clss)
      const wrapperStyle: JSX.CSSProperties = { ...props.style }

      // Display
      return <div
        style={wrapperStyle}
        className={wrapperClasses.value}>
        <Scrollgneugneu
          stickyBlocksViewportHeight='calc(100vh-60px)'
          stickyBlocksOffsetTop={60}
          pages={pagesData}
          thresholdOffset={generalSettings?.threshold_offset}
          bgColorTransitionDuration={generalSettings?.bg_color_transition_duration} />
      </div>
    }
  })
}

export type { Props, LongformOf }