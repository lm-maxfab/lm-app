import { Component, JSX } from 'preact'
import ArticleCredits from '../../components/ArticleCredits'
import ArticleHeader from '../../components/ArticleHeader'
import ArticleSeriesHighlight from '../../components/ArticleSeriesHighlight'
import ArticleThumb from '../../components/ArticleThumb'
import ComponentDemo from '../../components/ComponentDemo'
import Dyptich from '../../components/Dyptich'
import MediaCaption from '../../components/MediaCaption'
import MediaCredits from '../../components/MediaCredits'
import MediaDescription from '../../components/MediaDescription'
import bem from '../../utils/bem'

import palmiers from './test-assets/frame-1.jpg'
import mouette from './test-assets/frame-2.jpg'

import './styles.scss'
import BackgroundVideo from '../../components/BackgroundVideo'
import P5Thing from '../../components/WIPP5Thing'

interface Props {
  className?: string
  style?: JSX.CSSProperties
}

export default class DemoPage extends Component<Props, {}> {
  static clss: string = 'lm-layout-demo-page'
  clss = DemoPage.clss

  render () {
    const { props } = this

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      paddingTop: '35px'
    }

    return <div
      className={wrapperClasses.value}
      style={wrapperStyle}>

      <h1 className={bem(this.clss).elt('page-title').value}>
        LM Components
      </h1>

      <div style={{ width: '400px' }}>
        <ComponentDemo
          name='P5Thing'
          propsDescription={``}
          description=''
          component={<P5Thing
            height='400px'
            flow={400}
            aperture={20}
            gravity={1}
            maxSimultaneousGrains={100000}
            showStats={true} />} />
      </div>

      <ComponentDemo
        name='BackgroundVideo'
        propsDescription={`
          sourceUrl?: string
          fallbackUrl?: string`
        }
        description='Displays an autoplay video without controls, or a static image fallback'
        component={<BackgroundVideo
          fallbackUrl='https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg'
          sourceUrl='https://player.vimeo.com/progressive_redirect/playback/742207975/rendition/720p/file.mp4?loc=external&signature=f0dcd89921fa5a37ee86b1213cc1f87888eb915f4d79c6f41089410cefa9ed7d' />} />

      <ComponentDemo
        name='Dyptich'
        propsDescription={``}
        description='Displays images as a dyptich'
        component={<Dyptich
          tempo={60}
          mobileBehavior='merge'
          mergeOrder='alternate'
          leftImagesUrls={[palmiers, mouette]}
          rightImagesUrls={[palmiers, mouette].reverse()}
          mediaDescription='Une description'
          mediaCredits='Un crédit.' />} />

      <ComponentDemo
        name='ArticleCredits'
        description='Simple component that styles a text string as an article end credits block.'
        propsDescription={`
          className?: string
          style?: JSX.CSSProperties
          content?: VNode|string
        `}
        component={<ArticleCredits
          content='Article credits content' />} />

      <ComponentDemo
        name='ArticleHeader'
        description='Page header component for wideforms'
        propsDescription={`
          className?: string
          style?: JSX.CSSProperties
          fill1?: string
          fill2?: string
          fillTransitionTime?: string
        `}
        component={<ArticleHeader
          fill1='rgb(0, 0, 0)'
          fill2='rgb(0, 0, 0, .3)' />} />

      <ComponentDemo
        name='MediaDescription'
        description='Simple component that styles a text string as a media description'
        propsDescription={`
          className?: string
          style?: JSX.CSSProperties
          content?: VNode|string
        `}
        component={<MediaDescription
          content='Une description' />} />

      <ComponentDemo
        name='MediaCredits'
        description='Simple component that styles a text string as a media credits'
        propsDescription={`
          className?: string
          style?: JSX.CSSProperties
          content?: VNode|string
        `}
        component={<MediaCredits
          content='Un crédit' />} />

      <ComponentDemo
        name='MediaCaption'
        description='Simple component that puts together a description and a credit for a proper media caption'
        propsDescription={`
          className?: string
          style?: JSX.CSSProperties
          description?: VNode|string
          credits?: VNode|string
        `}
        component={<MediaCaption
          description='Une description'
          credits='Un crédit' />} />

      {/* <ComponentDemo
        name='Dyptich'
        propsDescription={``}
        description='Displays images as a dyptich'
        component={<Dyptich
          tempo={100}
          mobileBehavior='merge'
          leftImagesUrls={[palmiers, mouette]}
          rightImagesUrls={[palmiers, mouette].reverse()} />} /> */}

      <ComponentDemo
        name='ArticleThumb'
        description='Thumbnail card for an article'
        propsDescription={`
          className?: string
          style?: JSX.CSSProperties
          bgImageUrl?: string
          title?: string
          articleUrl?: string
          openNewTab?: boolean
          filterColor?: JSX.CSSProperties['backgroundColor']
          filterColorHover?: JSX.CSSProperties['backgroundColor']
        `}
        componentMaxWidth='600px'
        component={<ArticleThumb
          openNewTab
          filterColor='rgb(0, 0, 0, .4)'
          filterColorHover='rgb(0, 0, 0, .1)'
          title='Un titre de super article'
          articleUrl='https://github.com'
          bgImageUrl='https://upload.wikimedia.org/wikipedia/commons/9/9a/Gull_portrait_ca_usa.jpg' />} />

      <ComponentDemo
        name='ArticleSeriesHighlight'
        description='A component for highlighting main articles from a series'
        propsDescription={`
          className?: string
          style?: JSX.CSSProperties
          title?: VNode|string
          paragraph?: VNode|string
          buttonContent?: VNode|string
          buttonUrl?: string
          buttonOpensNewTab?: boolean
          buttonClickHandler?: (e: JSX.TargetedMouseEvent<HTMLAnchorElement>) => void
          thumbsData?: ArticleThumbProps[]
        `}
        component={<ArticleSeriesHighlight
          title={`Le titre d'une super série d'articles`}
          paragraph={`Le Monde dévoile pendant 4 jours des documents attestant des manoeuvres en coulisses de la société Uber pour faire pression sur les pouvoirs publics au cours de la période 2012-2014.`}
          buttonContent='Bougre, vas-tu cliquer ?'
          buttonUrl='https://github.com'
          buttonOpensNewTab
          buttonClickHandler={(e: JSX.TargetedMouseEvent<HTMLAnchorElement>) => {
            console.log('I handle click.')
          }}
          thumbsData={[{
            title: 'Un article',
            bgImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Gull_portrait_ca_usa.jpg',
            articleUrl: 'https://github.com'
          }, {
            title: 'Un article',
            bgImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Gull_portrait_ca_usa.jpg',
            articleUrl: 'https://github.com'
          }, {
            title: 'Un article',
            bgImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Gull_portrait_ca_usa.jpg',
            articleUrl: 'https://github.com'
          }, {
            title: 'Un article',
            bgImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Gull_portrait_ca_usa.jpg',
            articleUrl: 'https://github.com'
          }, {
            title: 'Un article',
            bgImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Gull_portrait_ca_usa.jpg',
            articleUrl: 'https://github.com'
          }, {
            title: 'Un article',
            bgImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Gull_portrait_ca_usa.jpg',
            articleUrl: 'https://github.com'
          }]} />} />

    </div>
  }
}
