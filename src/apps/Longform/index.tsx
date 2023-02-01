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
import CanvasGL from '../../modules/components/CanvasGL'

interface Props extends InjectedProps { }
interface State {
  scrollValue: number
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
    this.setState({ scrollValue: Number(e.target?.value) })
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
      {
        transitions: [['fade', 600]],
        depth: 'front',
        type: 'shader',
        id: 'test-shader-block',
        layout: 'right-half',
        trackScroll: true,
        content: 'https://assets-decodeurs.lemonde.fr/redacweb/2301-shader-module/shadertest.fs'
      }
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
      { id: 'test-shader-block' },
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
      {/* <input type="range" onInput={this.updateScrollValue} min={0} max={1} step={0.01} /> */}
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
            shadeToColor: "blue",
            textBelow: "text below",
          },
          {
            textBeforeTop: "text before top",
            textAbove: "text above",
            imageUrl: "https://assets-decodeurs.lemonde.fr/redacweb/32-2301-footer-crim/cover.png",
            shadeToColor: "blue",
          },
          {
            textAbove: "text above",
            imageUrl: "https://assets-decodeurs.lemonde.fr/redacweb/32-2301-footer-crim/cover.png",
            shadeToColor: "blue",
          },
        ]}
      ></Footer> */}
      {/* 
      <CanvasGL 
      width={600} 
      height={600}
      progression={this.state.scrollValue} 
      shader={`
      precision highp float;

      // utils
      
      // random
      float random (vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233)))*43758.5453123);
      }
      
      // map
      float map(float value, float min1, float max1, float min2, float max2) {
        float result = min2 + (value - min1) * (max2 - min2) / (max1 - min1);
        if (result < min2) {
          return min2;
        }
        if (result > max2) {
          return max2;
        }
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
      }
      
      // circle
      float circle(vec2 _pos, float _radius, float _smoothness) {
        vec2 dist = _pos-vec2(0.5);
      
        return smoothstep(_radius-(_radius*_smoothness),
                               _radius+(_radius*_smoothness),
                               dot(dist,dist)*4.0);
      }
      
      // perlin noise
      vec4 ppermute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
      vec4 ptaylorInvSqrt(vec4 r){return 1.79 - 0.85 * r;}
      vec3 pfade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
      
      float pnoise(vec3 P){
        vec3 Pi0 = floor(P); // Integer part for indexing
        vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
        Pi0 = mod(Pi0, 289.0);
        Pi1 = mod(Pi1, 289.0);
        vec3 Pf0 = fract(P); // Fractional part for interpolation
        vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
        vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
        vec4 iy = vec4(Pi0.yy, Pi1.yy);
        vec4 iz0 = Pi0.zzzz;
        vec4 iz1 = Pi1.zzzz;
      
        vec4 ixy = ppermute(ppermute(ix) + iy);
        vec4 ixy0 = ppermute(ixy + iz0);
        vec4 ixy1 = ppermute(ixy + iz1);
      
        vec4 gx0 = ixy0 / 7.0;
        vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
        gx0 = fract(gx0);
        vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
        vec4 sz0 = step(gz0, vec4(0.0));
        gx0 -= sz0 * (step(0.0, gx0) - 0.5);
        gy0 -= sz0 * (step(0.0, gy0) - 0.5);
      
        vec4 gx1 = ixy1 / 7.0;
        vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
        gx1 = fract(gx1);
        vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
        vec4 sz1 = step(gz1, vec4(0.0));
        gx1 -= sz1 * (step(0.0, gx1) - 0.5);
        gy1 -= sz1 * (step(0.0, gy1) - 0.5);
      
        vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
        vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
        vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
        vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
        vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
        vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
        vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
        vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
      
        vec4 norm0 = ptaylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
        g000 *= norm0.x;
        g010 *= norm0.y;
        g100 *= norm0.z;
        g110 *= norm0.w;
        vec4 norm1 = ptaylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
        g001 *= norm1.x;
        g011 *= norm1.y;
        g101 *= norm1.z;
        g111 *= norm1.w;
      
        float n000 = dot(g000, Pf0);
        float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
        float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
        float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
        float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
        float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
        float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
        float n111 = dot(g111, Pf1);
      
        vec3 fade_xyz = pfade(Pf0);
        vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
        vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
        float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
        return 2.2 * n_xyz;
      }
      
      vec3 pnoiseVec3(vec3 x) {
        float xx = x.x;
        float yy = x.y;
        float zz = x.z;
        return vec3(  pnoise(vec3( xx, x.y, x.z ) * 2. -1. ),
                      pnoise(vec3( yy - 19.1 , zz + 33.4 , x.x + 47.2 ) * 2. -1. ),
                      pnoise(vec3( zz + 74.2 , xx - 124.5 , yy + 99.4 ) * 2. -1. ) );
      }
      
      vec3 getPerlinTurbulence( vec2 position, float scale, float strength, float time ) {
        vec3 perlin = pnoiseVec3( vec3( position.xy, time ) * scale );
        perlin *= strength;
        return perlin;
      }
      // fin perlin noise
      
      
      // shader
      
      uniform float uTime;
      uniform float uProg;
      
      uniform float uRed;
      uniform float uGreen;
      uniform float uBlue;
      
      uniform vec2 uResolution;
      
      varying vec2 vUv;
      
      void main() {
        vec2 coord = vUv;
      
        vec3 color = vec3(1., 1., 0.);
      
        float borderWidth = 0.3;
      
        float bigRadius = 0.8;
        float smallRadius = bigRadius - borderWidth;
      
        float smallDisk = circle(coord, smallRadius, 0.8);
        float bigDisk = circle(coord, bigRadius, 0.8);
      
        float border = bigDisk - smallDisk;
      
        float noise = random(coord * sin(uTime) * 2.) * 0.6;
      
        color.r += (1. - coord.y) * (1. - bigDisk) * 0.2;
        color.g -= (1. - coord.y) * (1. - bigDisk) * 0.6;
      
        color.b += smallDisk;
      
        
        color.r -= smallDisk;
        color.g -= smallDisk;
      
        color.r += border / 6.;
        color.g += border / 6.;
        color.b += border / 6.;
      
        color -= (border + 0.) * noise;
      
        gl_FragColor = vec4(color, 1.);
      }
              `}
        ></CanvasGL> */}

      <Scrollgneugneu
        pages={pagesData}
        thresholdOffset={generalSettings?.threshold_offset}
        bgColorTransitionDuration={generalSettings?.bg_color_transition_duration} />
    </div >
  }
}

export type { Props, Longform }
export default appWrapper(Longform)
