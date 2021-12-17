import { Component, JSX, VNode } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'
import { Destination as DestinationType } from '../../types'
import DestinationHead from '../DestinationHead'
import DestinationContent from '../DestinationContent'

import './styles.scss'
import GroupDelay from '../../../modules/le-monde/utils/group-delay'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  fixedImage?: boolean
  photoUrl?: DestinationType['main_photo_url']
  shape?: DestinationType['shape']
  borderColor?: DestinationType['contrast_color']
  bgColor?: DestinationType['main_color']
  textColor?: DestinationType['contrast_color']
  position?: number
  title?: DestinationType['title']
  supertitle?: DestinationType['supertitle']
  isOpened?: boolean
  content?: DestinationType['content']
  url?: DestinationType['article_url']
  forceCoverInWindow?: boolean
  onOpenerClick?: (e: JSX.TargetedMouseEvent<HTMLButtonElement>) => void
}

interface State {
  contentHeight: number|null
}

class Destination extends Component<Props, State> {
  clss = 'dest22-destination'
  $contentWrapper: HTMLDivElement|null = null
  delayedSetContentWrapperHeight: GroupDelay['call']
  state: State = {
    contentHeight: null
  }

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR & LIFECYCLE
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
    this.setContentWrapperHeight = this.setContentWrapperHeight.bind(this)
    this.delayedSetContentWrapperHeight = new GroupDelay(this.setContentWrapperHeight, 400).call
    window.addEventListener('resize', this.delayedSetContentWrapperHeight)
  }

  componentDidMount () {
    this.delayedSetContentWrapperHeight()
  }

  componentDidUpdate () {
    this.delayedSetContentWrapperHeight()
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.delayedSetContentWrapperHeight)
  }

  setContentWrapperHeight () {
    if (this.$contentWrapper === null) return
    const $destinationContent = this.$contentWrapper.querySelector(`.${DestinationContent.clss}`)
    if ($destinationContent === null) return
    const { height } = $destinationContent.getBoundingClientRect()
    this.setState(curr => {
      if (curr.contentHeight === height) return null
      return { contentHeight: height }
    })
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props, state } = this

    /* Logic */
    const contentHeight = props.isOpened ? `${state.contentHeight}px` : '0px'

    /* Classes and style */
    const wrapperClasses = bem(props.className ?? '')
      .block(this.clss)
      .mod({ opened: props.isOpened ?? false })
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    /* Display */
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      <DestinationHead
        forceCoverInWindow={props.forceCoverInWindow}
        fixedImage={props.fixedImage}
        photoUrl={props.photoUrl}
        shape={props.shape}
        borderColor={props.borderColor}
        bgColor={props.bgColor}
        textColor={props.textColor}
        position={props.position}
        title={props.title}
        supertitle={props.supertitle}
        isOpened={props.isOpened}
        onOpenerClick={props.onOpenerClick} />
      <div
        style={{ ['--len-content-height']: contentHeight }}
        ref={node => { this.$contentWrapper = node }}
        className={bem(this.clss).elt('content-wrapper').value}>
        <DestinationContent
          textColor={props.textColor}
          bgColor={props.bgColor}
          borderColor={props.borderColor}
          content={props.content}
          url={props.url} />
      </div>
    </div>
  }
}

export type { Props }
export default Destination
