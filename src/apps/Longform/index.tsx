import { Component, JSX } from 'preact'
import Scrollgneugneu, { PropsPageData } from '../../modules/layouts/Scrollgneugneu'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
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
        mobileTransitions: [['grow', 600]],
      }, {
        id: 'first-back-block',
        depth: 'back',
        zIndex: 0,
        type: 'module',
        content: 'http://localhost:50003/module-1/index.js',
        layout: 'right-half',
        mobileLayout: 'left-half'
      }]
    }, {
      bgColor: 'red',
      blocks: [{
        depth: 'scroll',
        zIndex: 3,
        type: 'html',
        content: '<div style="height: 2000px; background-color: chocolate;">I am the second scroll content</div>',
        layout: 'left-half',
        mobileLayout: 'right-half',
        transitions: [['whirl', 600]],
        mobileTransitions: [['grow', 600]],
      }, {
        id: 'first-back-block'
      }, {
        id: 'second-back-block',
        type: 'html',
        depth: 'back',
        layout: 'right-half',
        content: '<div>I am the second back block</div>'
      }]
    },
    {},
    { blocks: [{id: 'first-back-block' }, {id: 'second-back-block' }] },
    { blocks: [{id: 'first-back-block' }] },
    { blocks: [{id: 'first-back-block' }, {id: 'second-back-block' }] },
    {},
    {},
    { blocks: [{id: 'first-back-block' }, {id: 'second-back-block' }] },
    { blocks: [{id: 'first-back-block' }, {id: 'second-back-block' }] }
  ]

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      <Scrollgneugneu
        pages={pagesData}
        thresholdOffset='80%'
        bgColorTransitionDuration='1s' />
    </div>
  }
}

export type { Props, Longform }
export default appWrapper(Longform)
