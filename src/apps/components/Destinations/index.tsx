import { Component, JSX } from 'preact'
import Paginator from '../../../modules/le-monde/components/Paginator'
import bem from '../../../modules/le-monde/utils/bem'
import { Destination as DestinationType } from '../../types'
import Destination from '../Destination'

import './styles.scss'

const isIos = /iP(ad|od|hone)/i.test(window.navigator.userAgent)
const isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)
const isOperaMini = navigator.userAgent.indexOf('Opera Mini') !== -1
const isOpera = (window as unknown as any).opera | (window as unknown as any).opr || (navigator.userAgent.indexOf(' OPR/') > -1) || (navigator.userAgent.indexOf(' Coast/') > -1) || (navigator.userAgent.indexOf(' OPiOS/') > -1)
const disableFixedBg = isIos || isSafari || isOperaMini || isOpera

interface Props {
  className?: string
  style?: JSX.CSSProperties
  openedDestinationId?: DestinationType['id']|null
  destinations?: DestinationType[]
  onDestinationOpenerClick?: (id: string) => void
}

interface State {
  backgroundColor: string
  textColor: string
}

class Destinations extends Component<Props, State> {
  static clss = 'dest22-destinations'
  clss = Destinations.clss
  
  constructor (props: Props) {
    super(props)
    const firstDestination = (props.destinations ?? [])[0]
    this.state = {
      backgroundColor: firstDestination?.main_color ?? 'transparent'
    } as State
    this.handlePageEnter = this.handlePageEnter.bind(this)
  }

  handlePageEnter (destId: string) {
    const currentDestination = this.props.destinations?.find(dest => dest.id === destId)
    if (currentDestination === undefined) return
    this.setState({
      backgroundColor: currentDestination.main_color,
      textColor: currentDestination.contrast_color
    })
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props, state } = this

    /* Classes and style */
    const wrapperClasses = bem(props.className ?? '').block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      ['--c-background-color']: state.backgroundColor
    }

    /* Display */
    return (
      <div
        className={wrapperClasses.value}
        style={wrapperStyle}>
        <Paginator
          delay={100}
          intervalCheck={false}
          triggerBound='bottom'
          onPageChange={(destId: string) => this.handlePageEnter(destId)}>
          {props.destinations?.map((dest, destPos) => {
            const opener = () => {
              if (props.onDestinationOpenerClick === undefined) return
              props.onDestinationOpenerClick(dest.id)
            }
            return <Paginator.Page value={dest.id}>
              <Destination
                fixedImage={disableFixedBg ? false : true}
                forceCoverInWindow={disableFixedBg ? true : false}
                photoUrl={disableFixedBg ? dest.main_photo_url_alt : dest.main_photo_url}
                shape={dest.shape}
                borderColor={state.textColor}
                bgColor={state.backgroundColor}
                textColor={state.textColor}
                position={destPos + 1}
                title={dest.title}
                supertitle={dest.supertitle}
                isOpened={props.openedDestinationId === dest.id}
                onOpenerClick={opener}
                content={dest.content}
                url={dest.article_url} />
            </Paginator.Page>
          })}
        </Paginator>
      </div>
    )
  }
}

export type { Props }
export default Destinations
