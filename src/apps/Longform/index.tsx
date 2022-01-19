import { Component, JSX } from 'preact'
import wrapper, { InjectedProps } from '../../wrapper'
import bem from '../../modules/le-monde/utils/bem'
import './styles.scss'
import ChapterHead from '../components/ChapterHead'
import Home from '../components/Home'
import ChapterRow from '../components/ChapterRow'
import ChapterBg from '../components/ChapterBg'
import ImageBlock from '../components/ImageBlock'
import Image from '../components/Image'
import Legend from '../components/Legend'
import Credits from '../components/Credits'
import ReadAlso from '../components/ReadAlso'

import fakeData from './fakeData'

interface Props extends InjectedProps {}

class Longform extends Component<Props, {}> {
  static clss: string = 'illus21-longform'
  clss = Longform.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    // Assign classes
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      marginTop: 'var(--len-nav-height)'
    }

    // Display
    return (
      <div
        style={wrapperStyle}
        className={wrapperClasses.value}>
        <Home
          className={bem(this.clss).elt('home').value}
          bgImageUrl={fakeData.home.bgImageUrl}
          bgSize={fakeData.home.bgSize}
          bgPosition={fakeData.home.bgPosition}
          bgOpacity={fakeData.home.bgOpacity}
          title={fakeData.home.title}
          kicker={fakeData.home.kicker} />
        <ChapterHead
          className={bem(this.clss).elt('intro').value}
          kicker={fakeData.intro.content} />
        {fakeData.chapters.map(chapter => {
          return <>
            <ChapterHead />
          </>
        })}
        <ChapterRow
          blocks={fakeData.chapters[0].rows[0].blocks} />
        {/* <ChapterBg /> */}
        {/* <Image
          url={fakeData.chapters[0].rows[0].blocks[0].imageUrl} />
        <Legend
          content={fakeData.chapters[0].rows[0].blocks[0].legend} />
        <Credits
          content={fakeData.chapters[0].rows[0].blocks[0].credits} />
        <ReadAlso
          content={fakeData.chapters[0].rows[0].blocks[0].readAlso}
          url={fakeData.chapters[0].rows[0].blocks[0].readAlsoUrl} /> */}
      </div>
    )
  }
}

export type { Props, Longform }
export default wrapper(Longform)
