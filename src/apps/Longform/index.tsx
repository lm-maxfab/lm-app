import { Component, JSX } from 'preact'
import DemoPage from '../../modules/layouts/DemoPage'
import Scrollgneugneu, { PageData } from '../../modules/layouts/Scrollgneugneu'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import './styles.scss'

interface Props extends InjectedProps {}
interface State {}

const fakeScrllGngnPagesData: PageData[] = [{
  bgColor: 'red',
  scrolling: {
    type: 'html',
    content: `<div style="height: 1200px;">I am the <strong>CONTENT</strong></div>`
  },
  fixed: [{
    type: 'html',
    zIndex: -2,
    content: `<div style="position: relative; top: 10px; left: 10px;">I am fixed at -2</div>`
  }, {
    type: 'html',
    zIndex: -1,
    content: `<div style="position: relative; top: 40px; left: 40px;">I am fixed at -1</div>`
  }, {
    type: 'html',
    zIndex: 1,
    content: `<div style="position: relative; top: 70px; left: 70px;">I am fixed at 1</div>`
  }, {
    type: 'html',
    zIndex: 2,
    content: `<div style="position: relative; top: 100px; left: 100px;">I am fixed at 2</div>`
  }]
}, {
  bgColor: 'green',
  scrolling: {
    type: 'html',
    content: `<div style="height: 1000px;">I am the <strong>CONTENT</strong></div>`
  },
  fixed: [{
    type: 'html',
    zIndex: -2,
    content: `<div style="position: relative; top: 60px; left: 60px;">I am fixed at -2</div>`
  }, {
    type: 'html',
    zIndex: -1,
    content: `<div style="position: relative; top: 90px; left: 90px;">I am fixed at -1</div>`
  }, {
    type: 'html',
    zIndex: 1,
    content: `<div style="position: relative; top: 70px; left: 70px;">I am fixed at 1</div>`
  }, {
    type: 'html',
    zIndex: 2,
    content: `<div style="position: relative; top: 100px; left: 100px;">I am fixed at 2</div>`
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
      <div style={{ height: '800px' }}>BEFORE SCRLGNGN</div>
      <Scrollgneugneu
        thresholdOffsed='100%'
        fixedBlocksHeight='100vh'
        pages={fakeScrllGngnPagesData} />
      <div style={{ height: '800px' }}>AFTER SCRLGNGN</div>
    </div>
  }
}

export type { Props, Longform }
export default appWrapper(Longform)
