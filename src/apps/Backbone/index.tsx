import { Component, JSX } from 'preact'
import Scrollator from '../../modules/layouts/Scrollator'
import { PageData, StyleVariantsData, SettingsData, CreditsData, ArticleBlockData } from '../types'
import { SheetBase } from '../../modules/utils/sheet-base'
import IntersectionObserverComponent from '../../modules/components/IntersectionObserver'
import ArticleCredits from '../../modules/components/ArticleCredits'
import Verbatim from '../components/Verbatim'
import './styles.scss'
import MediaCaption from '../../modules/components/MediaCaption'

interface Props {
  slotName: string
  sheetBase?: SheetBase
}

interface State {
  playingVideos: number[]
}

class Backbone extends Component<Props, State> {
  state: State = {
    playingVideos: []
  }

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
      <Scrollator
        pagesData={pagesData}
        fixedBlocksPanelHeight='100vh'
        styleVariantsData={styleVariantsData}
        animationDuration={300}
        thresholdOffset={settingsData?.scrollator_threshold_offset} />
      
      <div className='article-blocks'>
        {articleBlocksData.map((articleBlockData, articleBlockDataPos) => {
          let childComp: JSX.Element|null = null

          if (articleBlockData.type === 'verbatim') {
            childComp = <Verbatim
              imageUrl={articleBlockData.image_or_video_url}
              verbatimAuthor={articleBlockData.verbatim_author}
              verbatimAuthorRole={articleBlockData.verbatim_author_role}
              content={articleBlockData.content}
              contrastColor={articleBlockData.contrast_color}
              textColor={articleBlockData.text_color}
              borderColor={articleBlockData.border_color}
              bgColor={articleBlockData.bg_color} />

          } else if (articleBlockData.type === 'intertitre') {
            childComp = <img
              className='intertitre'
              src={articleBlockData.image_or_video_url} />

          } else if (articleBlockData.type === 'video') {
            childComp = <div className='video'>
              <IntersectionObserverComponent
                threshold={.3}
                callback={entry => {
                  const $video = entry.target.querySelector('video') as HTMLVideoElement|null
                  if ($video === null) return
                  if (entry.isIntersecting === true) $video.play()
                  else $video.pause()
                }}>
                <video loop muted>
                  <source src={articleBlockData.image_or_video_url} />
                </video>
                <MediaCaption
                  description={articleBlockData.image_or_video_legend}
                  credits={articleBlockData.image_or_video_credits} />
              </IntersectionObserverComponent>
            </div>
          } else if (articleBlockData.type === 'image') {
            childComp = <div className='image'>
              <img src={articleBlockData.image_or_video_url} />
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

      <div style={{
        padding: '40vh 8px',
        backgroundColor: 'transparent',
        color: '#0047A7',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{ maxWidth: '720px' }}>
          <ArticleCredits content={creditsData.content} />
        </div>
      </div>
    </>
  }
}

export type { Props, Backbone }
export default Backbone
