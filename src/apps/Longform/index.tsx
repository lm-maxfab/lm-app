import { Component, JSX } from 'preact'
import wrapper, { InjectedProps } from '../../wrapper'
import bem from '../../modules/le-monde/utils/bem'
import StickyHeader from '../components/StickyHeader'
import FixedIntroImage from '../components/FixedIntroImage'
import Intro from '../components/Intro'
import Chapters from '../components/Chapters'
import './styles.scss'

interface Props extends InjectedProps {}

class Longform extends Component<Props, {}> {
  static clss: string = 'prn-longform'
  clss = Longform.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    // Logic

    // Assign classes
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    // Display
    return (
      <div
        style={wrapperStyle}
        className={wrapperClasses.value}>
        <StickyHeader />
        <FixedIntroImage imgUrl='https://pixy.org/src/20/201310.jpg' />
        <Intro
          title={<>« C’était des viols sous prétexte de vidéos »</>}
          paragraph={<>En septembre 2021, Le Monde a envoyé 100 journalistes à travers la France afin de dresser le portrait d’un pays en proie à d’importants bouleversements sociétaux. Sans porter de jugement, nous rendons compte de nos observations à travers 100 reportages singuliers, riches, poignants tout au long du mois d’octobre.</>} />
        <Chapters chaptersData={[
          {
            id: 'lil',
            number: 1,
            title: <>ChapterTitle</>,
            kicker: <>Kicker</>,
            imageUrl: 'https://pixy.org/src/20/201310.jpg',
            articleUrl: 'https://pixy.org/src/20/201310.jpg'
          }, {
            id: 'lal',
            number: 2,
            title: <>ChapterTitle</>,
            kicker: <>Kicker</>,
            imageUrl: 'https://pixy.org/src/20/201310.jpg',
            articleUrl: 'https://pixy.org/src/20/201310.jpg'
          }, {
            id: 'loul',
            number: 3,
            title: <>ChapterTitle</>,
            kicker: <>Kicker</>,
            imageUrl: 'https://pixy.org/src/20/201310.jpg',
            articleUrl: 'https://pixy.org/src/20/201310.jpg'
          }
        ]} />
        {/* <Credits /> */}
      </div>
    )
  }
}

export type { Props, Longform }
export default wrapper(Longform)
