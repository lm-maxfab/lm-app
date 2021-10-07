import { Component, Context, JSX } from 'preact'
import clss from 'classnames'
import './styles.css'
import { FragmentSources } from '../../types'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  sources?: FragmentSources
  playVideo?: boolean
  isActive?: boolean
}

class WideFragmentIcono extends Component<Props, {}> {
  #mainClass: string = 'frag-wide-fragment-icono'
  get mainClass () { return this.#mainClass }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    const isActiveClass = `${this.#mainClass}_${props.isActive ? 'active' : 'inactive'}`
    const classes = clss(this.#mainClass, isActiveClass, props.className)
    const inlineStyle: JSX.CSSProperties = { ...props.style }

    const desktopImageUrl = props.sources?.image_desktop_url ?? props.sources?.image_mobile_url
    const mobileImageUrl = props.sources?.image_mobile_url ?? desktopImageUrl
    const imageUrl = document.documentElement.clientWidth > 1200
      ? desktopImageUrl
      : mobileImageUrl
    const imageStyle: JSX.CSSProperties = {
      backgroundImage: `url(${imageUrl})`,
      backgroundPosition: props.sources?.image_center
    }

    return (
      <div className={classes} style={inlineStyle}>
        <div className={`${this.#mainClass}__image`} style={imageStyle} />
      </div>
    )
  }
}

export type { Props }
export default WideFragmentIcono
