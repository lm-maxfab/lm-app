import { Component, JSX } from 'preact'
import clss from 'classnames'
import './styles.css'
import WideFragmentIcono from '../WideFragmentIcono'
import { Fragment as FragmentInterface, FragmentSources } from '../../types'
import IOComponent from '../../../modules/le-monde/components/IntersectionObserver'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  fragments?: FragmentInterface[]
}

interface State {
  activeFragmentId: string|null
}

class WideFragments extends Component<Props, State> {
  mainClass: string = 'frag-wide-fragments'
  state: State = { activeFragmentId: null }

  constructor (props: Props) {
    super(props)
    this.activateFragmentId = this.activateFragmentId.bind(this)
    this.maybeInactivateFragmentId = this.maybeInactivateFragmentId.bind(this)
  }

  /* * * * * * * * * * * * * * *
   * METHODS
   * * * * * * * * * * * * * * */
  activateFragmentId (id: string) {
    this.setState({ activeFragmentId: id })
  }

  maybeInactivateFragmentId (id: string) {
    this.setState(curr => {
      if (curr.activeFragmentId === id) {
        return {
          ...curr,
          activeFragmentId: null
        }
      } else return null
    })
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props, state } = this
    const classes: string = clss(this.mainClass, props.className)
    const inlineStyle = { ...props.style }

    return (
      <div className={classes} style={inlineStyle}>
        {props.fragments?.map((fragment, fragmentPos) => {
          const sources: FragmentSources = {
            vimeo_video_desktop_url: fragment.vimeo_video_desktop_url,
            vimeo_video_mobile_url: fragment.vimeo_video_mobile_url,
            decodeurs_video_desktop_url: fragment.decodeurs_video_desktop_url,
            decodeurs_video_mobile_url: fragment.decodeurs_video_mobile_url,
            video_poster_desktop_url: fragment.video_poster_desktop_url,
            video_poster_mobile_url: fragment.video_poster_mobile_url,
            image_desktop_url: fragment.image_desktop_url,
            image_mobile_url: fragment.image_mobile_url
          }
          const isActive = fragment.id === state.activeFragmentId
          const iconoClass = `${this.mainClass}__fragment-icono`
          const iconoActiveClass = `${iconoClass}_${isActive ? 'active' : 'inactive'}`
          const iconoClasses = clss(iconoClass, iconoActiveClass)
          return <div className={`${this.mainClass}__fragment`}>
            <WideFragmentIcono
              className={iconoClasses}
              playVideo={isActive}
              id={fragment.id}
              sources={sources} />
            <IOComponent
              threshold={.5}
              callback={ioe => {
                console.log(ioe.isIntersecting, fragment.id)
                ioe.isIntersecting
                  ? this.activateFragmentId(fragment.id)
                  : this.maybeInactivateFragmentId(fragment.id)
              }}>
              <div className={`${this.mainClass}__fragment-slot`}>
                <div>{fragment.region}</div>
                <div>{fragment.title}</div>
                <div>{fragment.subtitle}</div>
              </div>
            </IOComponent>
          </div>
        })}
      </div>
    )
  }
}

export type { Props, State }
export default WideFragments
