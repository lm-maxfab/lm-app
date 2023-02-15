import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import './styles.scss'
import { VideoData } from '../types'
import Video from '../../modules/components/Video'

interface Props extends InjectedProps {}
interface State {}

export default function VideoOf (slotName: string) {
  return appWrapper(class Longform extends Component<Props, State> {
    static clss: string = 'iran-video'
    clss = Longform.clss
  
    /* * * * * * * * * * * * * * *
     * RENDER
     * * * * * * * * * * * * * * */
    render (): JSX.Element {
      const { props } = this
      const { sheetBase } = props
      const videosData = sheetBase?.collection('videos').value as VideoData[]|undefined
      const videoData = videosData?.find(elt => elt.destination === slotName)

      if (videoData === undefined) return <></>
  
      // Assign classes and styles
      const wrapperClasses = bem(props.className).block(this.clss)
      const wrapperStyle: JSX.CSSProperties = { ...props.style }
  
      // Display
      return <div
        style={wrapperStyle}
        className={wrapperClasses.value}>
        <Video
          source={videoData?.source}
          sourceType={videoData?.sourceType}
          posterUrl={videoData?.posterUrl}
          title={videoData?.title}
          kicker={videoData?.kicker}
          description={videoData?.description}
          credits={videoData?.credits}
          alt={videoData?.alt}
          loop={videoData?.loop}
          autoplay={videoData?.autoplay}
          sound={videoData?.sound}
          soundControls={videoData?.soundControls}
          playControls={videoData?.playControls}
          timeControls={videoData?.timeControls}
          preload={videoData?.preload}
          disclaimer={videoData?.disclaimer}
          disclaimerText={videoData?.disclaimerText}
          disclaimerButton={videoData?.disclaimerButton}
          videoHeight={videoData?.height} />
      </div>
    }
  })
}

export type { Props, VideoOf }