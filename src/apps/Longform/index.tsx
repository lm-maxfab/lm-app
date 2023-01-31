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
import StopMotion from '../../modules/components/StopMotion'
import ArticleThumbV2 from '../../modules/components/ArticleThumbV2'
import Footer from '../../modules/components/Footer'

interface Props extends InjectedProps { }
interface State {
  scrollValue: 0
}

class Longform extends Component<Props, State> {
  static clss: string = 'sable-longform'
  clss = Longform.clss

  state: State = {
    scrollValue: 0
  }

  constructor(props: Props) {
    super(props)
    this.updateScrollValue = this.updateScrollValue.bind(this)
  }

  updateScrollValue(e: any) {
    this.setState({ scrollValue: e.target?.value })
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render(): JSX.Element {
    const { props } = this
    const { sheetBase } = props

    const pagesData: PropsPageData[] = [{
      bgColor: 'blue',
      blocks: [{
        id: 'first-scroll-block',
        depth: 'scroll',
        zIndex: 3,
        type: 'html',
        content: '<div style="height: 2000px; background-color: violet;">I am the first scroll content</div>',
        layout: 'left-half',
        mobileLayout: 'right-half',
        transitions: [['whirl', 600]],
        mobileTransitions: [['grow', 600]]
      }, {
        id: 'first-back-block',
        depth: 'back',
        zIndex: 0,
        type: 'module',
        content: 'http://localhost:50003/module-1/index.js',
        layout: 'right-half',
        mobileLayout: 'left-half',
        trackScroll: true
      },
    ]
    }, {
      bgColor: 'red',
      blocks: [{
        // id: 'second-scroll-block',
        depth: 'scroll',
        zIndex: 3,
        type: 'html',
        content: '<div style="height: 2000px; background-color: chocolate;">I am the second scroll content</div>',
        layout: 'left-half',
        mobileLayout: 'right-half',
        transitions: [['whirl', 600]],
        mobileTransitions: [['grow', 600]],
        trackScroll: false
      }, 
      {
        transitions: [['fade', 600]],
        id: 'motion-block',
        depth: 'back',
        zIndex: 0,
        type: 'motion',
        layout: 'right-half',
        content: `https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/1.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/2.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/3.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/4.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/5.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/6.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/7.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/8.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/9.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/10.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/11.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/12.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/13.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/14.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/15.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/16.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/17.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/18.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/19.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/20.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/21.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/22.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/23.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/24.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/25.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/26.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/27.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/28.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/29.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/30.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/31.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/32.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/33.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/34.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/35.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/36.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/37.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/38.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/39.png,
          https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/40.png`,
      }, {
        id: 'first-back-block'
      }, {
        id: 'second-back-block',
        type: 'html',
        depth: 'back',
        layout: 'right-half',
        content: '<div>I am the second back block</div>',
        trackScroll: true
      }]
    },
    { blocks: [{ id: 'first-scroll-block' }, { id: 'first-back-block' }, { id: 'second-back-block' }, { id: 'motion-block' }] },
    { blocks: [{ id: 'first-scroll-block' }, { id: 'first-back-block' }] },
    { blocks: [{ id: 'first-scroll-block' }, { id: 'first-back-block' }, { id: 'second-back-block' }] },
    { blocks: [{ id: 'first-scroll-block' }, { id: 'first-back-block' }, { id: 'second-back-block' }] },
    { blocks: [{ id: 'first-scroll-block' }, { id: 'first-back-block' }, { id: 'second-back-block' }] }
    ]

    const generalSettings = sheetBase?.collection('general_settings').entries[0].value as GeneralSettings | undefined
    const blocksData = sheetBase?.collection('blocks_data').value as BlockDataFromSheet[] | undefined
    const rawPagesData = sheetBase?.collection('pages_data').value as PageDataFromSheet[] | undefined
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
    //     id: rawPageData.id,
    //     showHeader: rawPageData.show_header,
    //     showNav: rawPageData.show_nav,
    //     headerLogoFill1: rawPageData.header_logo_fill_1,
    //     headerLogoFill2: rawPageData.header_logo_fill_2,
    //     chapterName: rawPageData.chapter_name,
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

    // const pagesData : PropsPageData[] = [{
    //   bgColor: 'coral',
    //   blocks: [{
    //     id: 'page',
    //     depth: 'scroll',
    //     type: 'html',
    //     content: `<div
    //       style="
    //         height: 1000px;
    //         display: flex;
    //         flex-direction: column;
    //         justify-content: space-around
    //       ">
    //       <p>Scroll</p>
    //       <p>Scroll</p>
    //       <p>Scroll</p>
    //       <p>Scroll</p>
    //     </div>`
    //   }]
    // }, {
    //   bgColor: 'aliceblue',
    //   blocks: [{ id: 'page' }]
    // }, {
    //   bgColor: 'violet',
    //   blocks: [{ id: 'page' }]
    // }, {
    //   bgColor: 'chocolate',
    //   blocks: [{
    //     id: 'page'
    //   }, {
    //     depth: 'front',
    //     type: 'module',
    //     content: 'http://localhost:50003/module-1/index.js',
    //     trackScroll: true
    //   }]
    // }]

    // const pagesData: PropsPageData[] = [{
    //   blocks: [{
    //     depth: 'front',
    //     type: 'html',
    //     content: '<div style="width: unset; background-color: blue; height: unset;">BACK</div>',
    //     layout: 'right-half-bottom'
    //   }, {
    //     depth: 'scroll',
    //     type: 'html',
    //     content: '<div style="height: 3000px; background-color: rgb(255, 127, 80, .2);">SCROLL</div>',
    //     layout: 'left-half'
    //   }]
    // }]

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    const imagesArray = []
    for (let i = 1; i <= 40; i++) {
      let imageUrl = 'https://assets-decodeurs.lemonde.fr/redacweb/2301-stop-motion-module/'
      imageUrl += i
      imageUrl += '.png'
      imagesArray.push(imageUrl)
    }

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      {/* <input type="range" onInput={this.updateScrollValue} min="0" max="1" step="0.01" /> */}
      {/* <StopMotion images={imagesArray} progression={this.state.scrollValue} /> */}

      {/* <ArticleThumbV2
        customClass={'custom-class'}
        customCss={'.lm-article-thumb { border: 1px solid red; }'}
        imageUrl={"https://assets-decodeurs.lemonde.fr/redacweb/32-2301-footer-crim/cover.png"}
        imageAlt={"alt de l'image"}
        textAbove={"text above"}
        textBelow={"text below"}
        textBeforeTop={"text before top"}
        textBeforeCenter={"text before center"}
        textBeforeBottom={"text before bottom"}
        textAfterTop={"text after top"}
        textAfterCenter={"text after center"}
        textAfterBottom={"text after bottom"}
        textInsideTop={"text inside top"}
        textInsideCenter={"text inside center"}
        textInsideBottom={"text inside bottom"}
        shadeToColor={'pink'}
        shadeFromColor={'transparent'}
        shadeFromPos={'0%'}
        shadeToPos={'80%'}
        status={'unpublished'}
        statusOverrides={
          {
            'unpublished': {
              textAbove: "text above -- unpublished!",
            }
          }
        }
      ></ArticleThumbV2> */}
{/* 
      <Footer
        customClass={'custom-class'}
        customCss={'.lm-article-footer { border: 1px solid red; }'}

        bgColor={'pink'}
        // bgImageUrl={'https://img.freepik.com/vecteurs-libre/fond-demi-teinte-vague-noire_1199-279.jpg'}

        shadeToColor={'coral'}
        shadeFromColor={'transparent'}
        shadeFromPos={'0%'}
        shadeToPos={'80%'}

        textAbove={'text above footer'}
        textBelow={'text below footer'}

        articleThumbsData={[
          {
            textAfterBottom: "text after bottom",
            imageUrl: "https://assets-decodeurs.lemonde.fr/redacweb/32-2301-footer-crim/cover.png",
            textBelow: "text below",
          },
          {
            textBeforeTop: "text before top",
            textAbove: "text above",
            imageUrl: "https://assets-decodeurs.lemonde.fr/redacweb/32-2301-footer-crim/cover.png",
          },
          {
            textAbove: "text above",
            imageUrl: "https://assets-decodeurs.lemonde.fr/redacweb/32-2301-footer-crim/cover.png",
          },
        ]}
      ></Footer> */}

      <Scrollgneugneu
        pages={pagesData}
        thresholdOffset={generalSettings?.threshold_offset}
        bgColorTransitionDuration={generalSettings?.bg_color_transition_duration} />
    </div >
  }
}

export type { Props, Longform }
export default appWrapper(Longform)
