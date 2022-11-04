import { Component, VNode, createRef } from 'preact'
import bem from '../../../modules/utils/bem'
import Marker from '../Marker'
import Circle from '../Circle'
import Gradient from '../Gradient'
import ScrollIcon from '../Icons/ScrollIcon'
import './styles.scss'

import getConfig from '../../../modules/utils/get-config'

const config = getConfig()

type Props = {
  title?: string | VNode,
  intro?: string,
}

type State = {
  anim?: boolean,
}

export const className = bem('mondial-guide-cover')

export default class GuideCover extends Component<Props, State> {
  private refContainer = createRef<HTMLDivElement>()

  state: State = {
    anim: false,
  }

  constructor(props: Props) {
    super(props)
    this.controlScroll = this.controlScroll.bind(this)
  }

  componentDidMount(): void {
    document.querySelector('body')?.classList.add('blocked')
    this.refContainer.current?.classList.add('init')
    window.addEventListener('wheel', (evt) => this.controlScroll(evt))
  }

  controlScroll(e: any): void {

    if (this.state.anim) {
      return
    }

    if (window.pageYOffset === 0 && e.deltaY > 10) {
      if (!this.refContainer.current?.classList.contains('init')) {
        return
      }

      this.setState(curr => ({
        ...curr,
        anim: true,
      }))

      this.refContainer.current?.classList.add('out')
      this.refContainer.current?.classList.remove('back')
      setTimeout(() => {
        document.querySelector('body')?.classList.remove('blocked')
        this.setState(curr => ({
          ...curr,
          anim: false,
        }))
      }, 2000);
    }

    if (window.pageYOffset === 0 && e.deltaY < -10) {
      if (!this.refContainer.current?.classList.contains('out')) {
        return
      }
      this.setState(curr => ({
        ...curr,
        anim: true,
      }))

      this.refContainer.current?.classList.remove('out')
      this.refContainer.current?.classList.add('back')
      document.querySelector('body')?.classList.add('blocked')
      window.removeEventListener('wheel', (evt) => this.controlScroll(evt))

      setTimeout(() => {
        this.setState(curr => ({
          ...curr,
          anim: false,
        }))
        this.refContainer.current?.classList.add('init')
      }, 1600);
    }
  }

  render() {
    const imgPlayer1 = `${config?.assets_root_url}/cover-1.png`
    const imgPlayer2 = `${config?.assets_root_url}/cover-2.png`

    return <div ref={this.refContainer} className={className.value}>
      <div className={className.elt('container').value}>

        <div className={className.elt('circle').value}>
          <Circle></Circle>
        </div>

        <div className={className.elt('gradient').value}>
          <Gradient />

          <div className={className.elt('circle').mod('overlay').value}>
            <Circle></Circle>
          </div>

          <div className={className.elt('text').value}>
            <div>
              <div className={className.elt('marker').value}>
                <Marker color='#fff' />
              </div>

              <p className={className.elt('title').value}>{this.props.title}</p>

              <div className={className.elt('scrollicon').value}>
                <ScrollIcon />
              </div>
            </div>
            <div>
              <p className={className.elt('intro').value}>{this.props.intro}</p>
            </div>
          </div>

        </div>

      </div>

      <img className={className.elt('player').mod('left').value} src={imgPlayer1} />
      <img className={className.elt('player').mod('right').value} src={imgPlayer2} />

    </div>
  }
}
