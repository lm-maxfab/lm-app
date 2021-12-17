import { Component, JSX } from 'preact'
import './styles.scss'
import { SheetBase } from '../../modules/le-monde/utils/sheet-base'
import bem from '../../modules/le-monde/utils/bem'
import getViewportDimensions from '../../modules/le-monde/utils/get-viewport-dimensions'
import { Destination as DestinationType, GeneralSettingsData } from '../types'
import DestinationWindow from '../components/DestinationWindow'
import DestinationSupertitle from '../components/DestinationSupertitle'
import DestinationTitle from '../components/DestinationTitle'
import DestinationOpener from '../components/DestinationOpener'
import Img from '../../modules/le-monde/components/Img'
import longformImgUrl from './assets/longform-img.jpg'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  sheetBase?: SheetBase
}

class Footer extends Component<Props, {}> {
  clss: string = 'dest22-footer'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    // Logic
    const { navHeight } = getViewportDimensions()
    const destinations = (props.sheetBase?.collection('destinations').value ?? []) as unknown as DestinationType[]
    const generalSettings = (props.sheetBase?.collection('general_settings').value ?? [])[0] as unknown as GeneralSettingsData

    // Assign classes
    const wrapperClasses = bem(props.className ?? '').block('lm-app').block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      '--nav-height': `${navHeight}px`
    }

    // Display
    return (
      <div
        className={wrapperClasses.value}
        style={wrapperStyle}>
        <DestinationOpener
          style={{
            position: 'absolute',
            right: '24px',
            top: '50%',
            zIndex: '2',
            transform: 'translateY(-50%)',
            opacity: .8,
            cursor: 'default'
          }}
          bgColor='transparent'
          borderColor='#0E1B4C' />
        <h3 className={bem(this.clss).elt('title').value}>
          Les autres voyages du <em>«&nbsp;Monde&nbsp;»</em>
        </h3>
        <div className={bem(this.clss).elt('destinations').value}>
          <a
            href={generalSettings.longform_url}
            className={bem(this.clss).elt('destination').mod('starter').value}>
            <Img src={longformImgUrl} />
            <DestinationTitle
              textColor='#0E1B4C'
              content='Découvrez les 20 destinations 2022' />
          </a>
          {destinations
            .filter(({ article_url: url }) => {
              if (typeof url !== 'string' || url.length <= 0) return false
              return true
            }).map((destination) => {
              return <a
                href={destination.article_url}
                className={bem(this.clss).elt('destination').value}>
                <DestinationWindow  
                  fixedImage={false}
                  forceBgCover={true}
                  photoUrl={destination.main_photo_url_alt}
                  shape={destination.shape} />
                <DestinationSupertitle
                  textColor='#0E1B4C'
                  content={destination.supertitle} />
                <DestinationTitle
                  textColor='#0E1B4C'
                  content={destination.title} />
              </a>
            })
          }
        </div>
      </div>
    )
  }
}

export type { Props }
export default Footer
