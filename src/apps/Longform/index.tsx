import { Component, JSX } from 'preact'
import Scrollgneugneu, { PageData } from '../../modules/layouts/Scrollgneugneu'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import './styles.scss'

interface Props extends InjectedProps {}
interface State {}

const pagesData: PageData[] = [{
  // PAGE 1
  bgColor: 'limegreen',
  blocks: [{
    depth: 'scroll',
    type: 'html',
    layout: 'left-half',
    mobileLayout: 'right-half',
    content: `<div style="
      height: 100vw;
      width: calc(100% - 160px);
      background-color: black;
      color: white;
      margin: 80px;
      display: flex;
      justify-content: center;
      padding: 40px 120px">
      First page lorem ipsum dolor sit ampet cons
    </div>`
  }, /*{
    id: 'leftblock',
    depth: 'back',
    type: 'html',
    layout: 'left-half',
    mobileLayout: 'left-half',
    transitions: [
      ['fade', 2000],
      ['grow', 600],
      ['whirl', 600],
      // ['slide-up', 600]
    ],
    mobileTransitions: [
      ['fade', 600],
      ['whirl', 600],
      ['grow', 600]
    ],
    content: '<div style="background-color: yellow; width: 100%; height: 20%">I am the back block</div>'
  }, */{
    id: 'rightblock',
    depth: 'front',
    type: 'module',
    layout: 'right-half',
    mobileLayout: 'right-half',
    transitions: [
      ['whirl', 600]
    ],
    mobileTransitions: [
      ['left-open', 600]
    ],
    content: 'http://localhost:3003/index.js'
  }]
}, {
  bgColor: 'orange',
  blocks: [{
    depth: 'scroll',
    type: 'html',
    content: '<div style="height: 100vw;">I am the second page</div>'
  }]
}, {
  bgColor: 'violet',
  blocks: [{
    depth: 'scroll',
    type: 'html',
    content: '<div style="height: 100vw; color: white">I am the third page</div>'
  }/*, {
    id: 'leftblock'
  }, {
    id: 'rightblock'
  }*/]
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
      <div style={{ height: '600px' }}>BEFORE SCRLGNGN</div>
      <Scrollgneugneu
        fixedBlocksHeight='100vh'
        pages={pagesData} />
      <div style={{ height: '600px' }}>AFTER SCRLGNGN</div>
    </div>
  }
}

export type { Props, Longform }
export default appWrapper(Longform)
