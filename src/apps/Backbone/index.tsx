import { Component, JSX } from 'preact'
import Scrollator from '../../modules/layouts/Scrollator'
import { PageData, StyleVariantsData, SettingsData, CreditsData, ArticleBlockData } from '../types'
import { SheetBase } from '../../modules/utils/sheet-base'
import IntersectionObserverComponent from '../../modules/components/IntersectionObserver'
import ArticleCredits from '../../modules/components/ArticleCredits'
import Verbatim from '../components/Verbatim'
import './styles.scss'
import MediaCaption from '../../modules/components/MediaCaption'
import ArticleHeader from '../../modules/components/ArticleHeader'
import bem from '../../modules/utils/bem'
import ratioUrl from './16x9.png'

interface Props {
  slotName: string
  sheetBase?: SheetBase
}

interface State {
  headerState: 'light'|'dark'
}

class Backbone extends Component<Props, State> {
  state: State = { headerState: 'light' }
  $scrollatorWrapper: HTMLDivElement|null = null
  render (): JSX.Element {
    const { props, state } = this

    // Extract data
    const allPagesData = (props.sheetBase?.collection('scrollator-pages').value ?? []) as unknown as PageData[]
    const styleVariantsData = (props.sheetBase?.collection('scrollator-style-variants').value ?? []) as unknown as StyleVariantsData[]
    const settingsData = (props.sheetBase?.collection('scrollator-settings').entries[0]?.value ?? {}) as unknown as SettingsData
    const creditsData = (props.sheetBase?.collection('credits').entries[0]?.value ?? {}) as unknown as CreditsData
    const articleBlocksData = (props.sheetBase?.collection('article-blocks').value ?? []) as unknown as ArticleBlockData[]
    const pagesData = allPagesData.filter(pageData => pageData.destination_slot === props.slotName)

    // Display
    return <>
      <ArticleHeader
        style={{ zIndex: 30, position: 'fixed' }}
        fill1={state.headerState === 'light' ? 'white' : 'black'}
        fill2={state.headerState === 'light' ? 'rgb(255, 255, 255, .3)' : 'rgb(0, 0, 0, .3)'} />
      <IntersectionObserverComponent
        threshold={.05}
        callback={entry => { this.setState({ headerState: entry.isIntersecting ? 'light' : 'dark' }) }}>
        <div
          ref={n => { this.$scrollatorWrapper = n }}
          onClick={e => {
            const { $scrollatorWrapper } = this
            if ($scrollatorWrapper === null) return
            const videos = $scrollatorWrapper.querySelectorAll('video')
            videos.forEach(video => { video.play() })
        }}>
          <Scrollator
            pagesData={pagesData}
            fixedBlocksPanelHeight='100vh'
            styleVariantsData={styleVariantsData}
            animationDuration={300}
            thresholdOffset={settingsData?.scrollator_threshold_offset} />
        </div>
      </IntersectionObserverComponent>
      <div className='article-blocks'>
        {articleBlocksData.map(articleBlockData => {
          let childComp: JSX.Element|null = null
          // VERBATIM
          if (articleBlockData.type === 'verbatim') {
            childComp = <Verbatim
              imageUrl={articleBlockData.image_or_video_url}
              verbatimAuthor={articleBlockData.verbatim_author}
              verbatimAuthorRole={articleBlockData.verbatim_author_role}
              content={articleBlockData.content} />
          // INTERTITRE
          } else if (articleBlockData.type === 'intertitre') {
            childComp = <div
              className='intertitre'>
              {articleBlockData.content}
            </div>

          // VIDEO
          } else if (
            articleBlockData.type === 'video'
            || articleBlockData.type === 'wide-video') {
            const classes = ['video']
            if (articleBlockData.type === 'wide-video') classes.push('video_wide')
            childComp = <div className={classes.join(' ')}>
              <IntersectionObserverComponent
                threshold={.3}
                callback={async entry => {
                  const $video = entry.target.querySelector('video') as HTMLVideoElement|null
                  if ($video === null) return
                  if (entry.isIntersecting === true) {
                    try { await $video.play() }
                    catch (err) { $video.setAttribute('controls', 'true') }
                  } else $video.pause()
                }}>
                <video playsInline loop muted poster={articleBlockData.video_poster_url}>
                  <source src={articleBlockData.image_or_video_url} />
                </video>
                <MediaCaption
                  description={articleBlockData.image_or_video_legend}
                  credits={articleBlockData.image_or_video_credits} />
              </IntersectionObserverComponent>
            </div>

          // IMAGE
          } else if (
            articleBlockData.type === 'image'
            || articleBlockData.type === 'wide-image') {
            const classes = ['image']
            if (articleBlockData.type === 'wide-image') classes.push('image_wide')
            childComp = <div className={classes.join(' ')}>
              <img src={articleBlockData.image_or_video_url} />
              <MediaCaption
                description={articleBlockData.image_or_video_legend}
                credits={articleBlockData.image_or_video_credits} />
            </div>

          // EMBED
          } else if (
            articleBlockData.type === 'embed'
            || articleBlockData.type === 'wide-embed') {
            const classes = ['embed']
            if (articleBlockData.type === 'wide-embed') classes.push('embed_wide')
            childComp = <div className={classes.join(' ')}>
              <div className={bem('embed').elt('inner').value}>
                <img
                  src={ratioUrl}
                  className={bem('embed').elt('ratio').value} />
                <iframe
                  src={articleBlockData.image_or_video_url}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen />
              </div>
              <MediaCaption
                description={articleBlockData.image_or_video_legend}
                credits={articleBlockData.image_or_video_credits} />
            </div>
          }

          return <div className='article-block'>
            {childComp}
          </div>
        })}
      </div>

      <div className='credits-block'>
        <div className='credits-block-inner'>
          <ArticleCredits content={creditsData.content} />
        </div>
      </div>
    </>
  }
}

export type { Props, Backbone }
export default Backbone
