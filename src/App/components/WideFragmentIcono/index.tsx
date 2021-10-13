import { Component, Fragment, JSX } from 'preact'
import clss from 'classnames'
import './styles.css'
import { FragmentSources } from '../../types'

interface MyNavigator extends Navigator {
  mozConnection?: NetworkInformation
  webkitConnection?: NetworkInformation
}

interface MyConnection extends NetworkInformation {
  downlink?: number
}

let currentDownlink: number = getCurrentDownlink()

function getCurrentDownlink () {
  const navigator = window.navigator as MyNavigator|undefined
  const connection = (navigator?.connection ?? navigator?.mozConnection ?? navigator?.webkitConnection) as MyConnection|undefined
  const downlink = connection?.downlink ?? 0
  return downlink
}

interface Props {
  className?: string
  style?: JSX.CSSProperties
  sources?: FragmentSources
  fragmentUrl?: string
  playVideo?: boolean
  isActive?: boolean
}

class WideFragmentIcono extends Component<Props, {}> {
  _mainClass: string = 'frag-wide-fragment-icono'
  get mainClass () { return this._mainClass }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    /* Logic */
    const isDesktop = document.documentElement.clientWidth > 800

    // Videos
    const rawDkVimeoVid1080url = props.sources?.vimeo_video_desktop_1080_url
    const rawDkVimeoVid720url = props.sources?.vimeo_video_desktop_720_url
    const rawDkVimeoVid540url = props.sources?.vimeo_video_desktop_540_url
    const rawDkVimeoVid360url = props.sources?.vimeo_video_desktop_360_url
    const rawSmVimeoVid648url = props.sources?.vimeo_video_mobile_648_url
    const rawSmVimeoVid432url = props.sources?.vimeo_video_mobile_432_url

    const dkVimeoVid1080url = rawDkVimeoVid1080url ?? rawDkVimeoVid720url ?? rawDkVimeoVid540url ?? rawDkVimeoVid360url
    const dkVimeoVid720url = rawDkVimeoVid720url ?? rawDkVimeoVid540url ?? rawDkVimeoVid360url ?? dkVimeoVid1080url
    const dkVimeoVid540url = rawDkVimeoVid540url ?? rawDkVimeoVid360url ?? dkVimeoVid720url ?? dkVimeoVid1080url
    const dkVimeoVid360url = rawDkVimeoVid360url ?? dkVimeoVid540url ?? dkVimeoVid720url ?? dkVimeoVid1080url
    
    const smVimeoVid648url = rawSmVimeoVid648url ?? rawSmVimeoVid432url ?? dkVimeoVid540url
    const smVimeoVid432url = rawSmVimeoVid432url ?? smVimeoVid648url ?? dkVimeoVid360url

    const dkVimeoVidUrl = currentDownlink >= 6
      ? dkVimeoVid1080url
      : currentDownlink >= 3
        ? dkVimeoVid720url
        : currentDownlink >= 1
          ? dkVimeoVid540url
          : dkVimeoVid360url
    
    const smVimeoVidUrl = currentDownlink >=2 ? smVimeoVid648url : smVimeoVid432url

    const vimeoVidUrl = isDesktop ? dkVimeoVidUrl : smVimeoVidUrl


    // Images
    const rawDkImgHdUrl = props.sources?.wide_cover_desktop_hd_url
    const rawDkImgSdUrl = props.sources?.wide_cover_desktop_sd_url
    const rawSmImgHdUrl = props.sources?.wide_cover_mobile_hd_url
    const rawSmImgSdUrl = props.sources?.wide_cover_mobile_sd_url

    const dkImgHdUrl = rawDkImgHdUrl ?? rawSmImgHdUrl
    const dkImgSdUrl = rawDkImgSdUrl ?? rawSmImgSdUrl
    const smImgHdUrl = rawSmImgHdUrl ?? dkImgHdUrl
    const smImgSdUrl = rawSmImgSdUrl ?? dkImgSdUrl

    const hdImgUrl = isDesktop ? dkImgHdUrl : smImgHdUrl
    const sdImgUrl = isDesktop ? dkImgSdUrl : smImgSdUrl
    const imgUrl = currentDownlink >= 2 ? hdImgUrl : sdImgUrl

    const dkImgCenter = props.sources?.wide_cover_desktop_center ?? '50% 50%'
    const smImgCenter = props.sources?.wide_cover_mobile_center ?? '50% 50%'
    const imgCenter = isDesktop ? dkImgCenter : smImgCenter

    const imageStyle: JSX.CSSProperties = {
      backgroundImage: `url(${imgUrl})`,
      backgroundPosition: imgCenter
    }

    /* Classes */
    const isActiveClass = `${this._mainClass}_${props.isActive ? 'active' : 'inactive'}`
    const classes = clss(this._mainClass, isActiveClass, props.className)
    const inlineStyle: JSX.CSSProperties = { ...props.style }

    return (
      <div className={classes} style={inlineStyle}>
        <a href={props?.fragmentUrl} target='_blank'>
          <div className={`${this._mainClass}__image`} style={imageStyle} />
          <div className={`${this._mainClass}__video`}>
            <video autoPlay muted loop>
              <source src={vimeoVidUrl} type='video/mp4' />
            </video>
          </div>
        </a>
      </div>
    )
  }
}

export type { Props }
export default WideFragmentIcono
