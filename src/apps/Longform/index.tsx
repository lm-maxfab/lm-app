import { Component, JSX } from 'preact'
import Scrollgneugneu, { PageData } from '../../modules/layouts/Scrollgneugneu'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import './styles.scss'

interface Props extends InjectedProps {}
interface State {}

const pagesData: PageData[] = [{
  // PAGE 1
  bgColor: 'green',
  blocks: [{
    depth: 'scroll',
    type: 'html',
    layout: 'left-half',
    mobileLayout: 'right-half',
    content: `<div style="
      height: 110vh;
      width: calc(100% - 160px);
      background-color: black;
      color: white;
      margin: 80px;
      display: flex;
      justify-content: center;
      padding: 40px 120px">
      First page lorem ipsum dolor sit ampet cons
    </div>`
  }, {
    id: 'leftblock',
    depth: 'back',
    type: 'html',
    layout: 'left-half',
    mobileLayout: 'right-half',
    transitions: [
      ['in-fade', 2000],
      ['out-fade', 2000],
      ['in-grow', 2000],
      ['out-grow', 2000],
    ],
    mobileTransitions: [
      ['in-fade', 1200],
      ['out-fade', 400]
    ],
    content: '<div style="background-color: yellow; width: 100%; height: 20%">I am the back block</div>'
  }, {
    id: 'rightblock',
    depth: 'front',
    type: 'html',
    layout: 'right-half',
    mobileLayout: 'left-half',
    transitions: [
      ['in-fade', 1200],
      ['out-fade', 400]
    ],
    mobileTransitions: [
      ['in-fade', 400],
      ['out-fade', 1200]
    ],
    content: '<div style="background-color: yellow; width: 100%; height: 20%">I am the front block</div>'
  }]
}, {
  bgColor: 'green',
  blocks: [{
    depth: 'scroll',
    type: 'html',
    content: '<div style="height: 140vh;">I am the second page</div>'
  }]
}, {
  bgColor: 'black',
  blocks: [{
    depth: 'scroll',
    type: 'html',
    content: '<div style="height: 200vh; color: white">I am the third page</div>'
  }, {
    id: 'leftblock'
  }, {
    id: 'rightblock'
  }]
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
