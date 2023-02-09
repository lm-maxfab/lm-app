import { Component, JSX } from 'preact'
import Scrollgneugneu, { Props as ScrollgngnProps, PropsPageData, PropsBlockData } from '../../modules/layouts/Scrollgneugneu'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import './styles.scss'
import {
  GeneralSettings,
  BlockData as BlockDataFromSheet,
  PageData as PageDataFromSheet
} from '../types'
import generateNiceColor from '../../modules/utils/generate-nice-color'
import { generateContentPage } from '../../modules/utils/generate-html-placeholders'

interface Props extends InjectedProps {}
interface State {}

const generalSettings: Partial<GeneralSettings> = {
  thresholdOffset: '60%',
  headerCustomCss: '.content-page > * { margin-bottom: 24px; } .content-page .title, .content-page .intertitle { font-weight: 600; }'
}
const pagesData: PropsPageData[] = [{
  bgColor: generateNiceColor(),
  blocks: [{
    id: 'content-scroll-page',
    depth: 'scroll',
    type: 'html',
    content: `<div style="background: white; font-family: var(--ff-marr-sans); padding: 64px; width: 400px;">${generateContentPage(4)}</div>`,
  }]
}, {
  bgColor: generateNiceColor(),
  blocks: [{
    id: 'content-scroll-page'
  }]
}]

class Longform extends Component<Props, State> {
  static clss: string = 'scrllgngn-longform'
  clss = Longform.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this
    const { sheetBase } = props

    // const generalSettings = sheetBase?.collection('general_settings').entries[0].value as GeneralSettings|undefined
    // const blocksData = sheetBase?.collection('blocks_data').value as BlockDataFromSheet[]|undefined
    // const rawPagesData = sheetBase?.collection('pages_data').value as PageDataFromSheet[]|undefined
    // const pagesData: PropsPageData[]|undefined = rawPagesData?.map(rawPageData => {
    //   const fixedBlocksData: PropsBlockData[] = []
    //   rawPageData.blocksIds?.split(',').map(name => {
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
    //     id: rawPageData.id,
    //     showHeader: rawPageData.showHeader,
    //     showNav: rawPageData.showNav,
    //     headerLogoFill1: rawPageData.headerLogoFill1,
    //     headerLogoFill2: rawPageData.headerLogoFill2,
    //     headerCustomClass: rawPageData.headerCustomClass,
    //     headerCustomCss: rawPageData.headerCustomCss,
    //     headerNavItemsAlign: rawPageData.headerNavItemsAlign,
    //     chapterName: rawPageData.chapterName,
    //     isChapterHead: rawPageData.isChapterHead,
    //     bgColor: rawPageData.bgColor,
    //     blocks: [{
    //       depth: 'scroll',
    //       type: 'html',
    //       content: rawPageData.content,
    //       layout: rawPageData.layout as PropsBlockData['layout'],
    //       mobileLayout: rawPageData.mobileLayout as PropsBlockData['mobileLayout']
    //     }, ...fixedBlocksData]
    //   }
    // })

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      <Scrollgneugneu
        pages={pagesData}
        thresholdOffset={generalSettings?.thresholdOffset}
        bgColorTransitionDuration={generalSettings?.bgColorTransitionDuration}
        stickyBlocksLazyLoadDistance={generalSettings?.lazyLoadDistance}
        stickyBlocksViewportHeight={generalSettings?.viewportHeight}
        stickyBlocksOffsetTop={generalSettings?.topOffset}
        headerCustomClass={generalSettings?.headerCustomClass}
        headerCustomCss={generalSettings?.headerCustomCss}
        headerNavItemsAlign={generalSettings?.headerNavItemsAlign} />
    </div>
  }
}

export type { Props, Longform }
export default appWrapper(Longform)
