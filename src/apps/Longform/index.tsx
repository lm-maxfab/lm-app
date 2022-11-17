import { Component, JSX } from 'preact'
import Scrollgneugneu, { PageData } from '../../modules/layouts/Scrollgneugneu'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import './styles.scss'

interface Props extends InjectedProps {}
interface State {}

const pagesData: PageData[] = [{
  bgColor: 'green',
  blocks: [
    { depth: 'scroll', type: 'html', content: `<div style="height: 1200px;">First page lorem ipsum dolor sit ampet cons</div>` },
    { depth: 'front', type: 'html', content: `<div style="position: relative; background-color: rgb(200, 200, 200, 1); top: 0px;">P1. FRONT 1</div>`, id: 'first' },
    { depth: 'front', type: 'html', content: `<video loop autoplay muted playsinline style="top: 200px; left: 100px; position: relative; width: 200px; height: 200px;"><source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm" /></video>`, zIndex: 2000, id: 'video' },
    { depth: 'front', zIndex: -1, type: 'module', content: 'http://localhost:3003/index.js', id: 'module' }
  ]
}, {
  bgColor: 'coral',
  blocks: [
    { depth: 'scroll', type: 'html', content: `<div style="height: 1200px;">Second page lorem ipsum dolor sit ampet cons</div>` },
    { depth: 'back', type: 'html', content: `<div style="position: relative; background-color: rgb(200, 200, 200, 1); top: 50px;">P2. BACK 1</div>` },
    { depth: 'front', type: 'html', content: `<div style="position: relative; background-color: rgb(200, 200, 200, 1); top: 100px;">P2. FRONT 1</div>`, zIndex: 600 },
    { depth: 'back', type: 'html', content: `<div style="position: relative; background-color: rgb(200, 200, 200, 1); top: 150px;">P2. BACK 2</div>`, zIndex: 1000 },
    { depth: 'front', id: 'video' },
    { depth: 'front', id: 'module' }
  ]
}, {
  bgColor: 'violet',
  blocks: [
    { depth: 'scroll', type: 'html', content: `<div style="height: 1200px;">Third page lorem ipsum dolor sit ampet cons</div>` },
    { depth: 'back', type: 'html', content: `<div style="position: relative; background-color: rgb(200, 200, 200, 1); top: 200px;">P3. BACK 1</div>` },
    { id: 'first' },
    { depth: 'front', id: 'video' }
  ]
}]

class Longform extends Component<Props, State> {
  static clss: string = 'sable-longform'
  clss = Longform.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      <div style={{ height: '800px' }}>BEFORE SCRLGNGN</div>
      <Scrollgneugneu
        fixedBlocksHeight='100vh'
        pages={pagesData} />
      <div style={{ height: '800px' }}>AFTER SCRLGNGN</div>
    </div>
  }
}

export type { Props, Longform }
export default appWrapper(Longform)
