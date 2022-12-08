import { Component, JSX } from 'preact'
import Scrollgneugneu, { PageData } from '../../modules/layouts/Scrollgneugneu'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import bem from '../../modules/utils/bem'
import './styles.scss'

const niceColors = ['fuchsia', 'teal', 'aliceblue', 'bisque', 'blueviolet', 'burlywood', 'chocolate', 'coral', 'cornflowerblue', 'crimson', 'darkblue', 'darkgoldenrod', 'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkslateblue', 'darkslategray', 'darkviolet', 'deeppink', 'deepskyblue', 'dodgerblue', 'firebrick', 'floralwhite', 'gainsboro', 'gold', 'hotpink', 'indianred', 'indigo', 'khaki', 'lavender', 'lightcoral', 'lightgreen', 'lightsalmon', 'lightsteelblue', 'limegreen', 'magenta', 'mediumseagreen', 'mediumspringgreen', 'mediumvioletred', 'moccasin', 'orangered', 'orchid', 'palegoldenrod', 'palevioletred', 'peachpuff', 'peru', 'plum', 'royalblue', 'sandybrown', 'springgreen', 'tan', 'thistle', 'tomato', 'violet', 'wheat', 'yellowgreen']
const generateNiceColor = () => {
  const pos = Math.floor(Math.random() * niceColors.length)
  return niceColors[pos]
}

const allSentencesArr = 'Etiam consequat interdum elit eu interdum. Nunc eu nulla vel arcu mattis venenatis sit amet gravida sem. Mauris pretium aliquam augue vitae tempor. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam mollis in ipsum nec efficitur. Nullam imperdiet et urna vitae suscipit. In hac habitasse platea dictumst. Nullam lacinia commodo enim non iaculis. Nam elementum tellus ac lectus aliquam porta. Mauris ut lorem nec magna porttitor efficitur sed sed odio. Ut in dapibus nulla, non eleifend elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Maecenas posuere leo neque, a luctus quam feugiat in. Phasellus lobortis egestas cursus. In sit amet massa et sem scelerisque facilisis quis fringilla felis. Praesent purus velit, vehicula id orci ac, placerat congue quam. Cras vulputate nisi eu justo accumsan malesuada. Vestibulum ex urna, volutpat non quam in, vulputate pellentesque est. Pellentesque interdum orci in quam finibus faucibus. In eget lectus augue. Vestibulum lobortis vulputate odio. Nam vitae felis in lorem dignissim venenatis. Curabitur bibendum, est quis tempor efficitur, magna orci facilisis erat, id rhoncus massa ante non tellus. Etiam id gravida elit. Mauris ut semper risus. Nulla sed interdum lorem. Nullam eu consectetur purus. Praesent ut enim diam. Nulla hendrerit dapibus eros, sit amet rhoncus eros consequat aliquam. Duis viverra erat vel commodo facilisis. Quisque hendrerit posuere sapien, id cursus ligula rhoncus vitae. Ut et turpis augue. Aliquam augue lorem, fringilla at magna eu, egestas sagittis ex. Vestibulum elementum diam facilisis elit ultrices, eget viverra massa venenatis. Nullam finibus ligula est. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam condimentum, justo pulvinar posuere tincidunt, mi libero convallis sapien, id consectetur nunc tellus eget nisi. Fusce tincidunt sit amet enim vitae feugiat. Etiam in nulla vitae orci consequat vulputate. Vestibulum sodales urna sit amet velit elementum, vel fringilla eros iaculis. Vestibulum gravida tempus nulla, at vulputate nunc aliquam vitae. Phasellus ac augue et augue finibus congue ut nec nunc. Ut in dictum lectus, eget efficitur dui. Suspendisse bibendum congue arcu, sit amet maximus felis dictum sit amet. Morbi scelerisque feugiat risus, id pellentesque elit cursus nec. Vivamus at erat id magna sagittis cursus vitae eu magna. Integer pretium nec lorem at consectetur. Integer id justo vitae nunc gravida posuere eu vel magna. Donec ex nunc, condimentum id laoreet et, scelerisque nec enim. Sed venenatis, augue vel posuere ullamcorper, lorem velit auctor erat, a auctor mi odio id velit. Donec justo erat, tempor ut diam sed, scelerisque aliquam dolor. Donec erat dui, dictum a tortor sit amet, pellentesque blandit risus. Donec tincidunt ligula ex, vel tincidunt leo posuere sit amet. Curabitur lacinia blandit pellentesque. Donec fringilla aliquam purus ac porta. Fusce faucibus convallis leo, ut aliquet libero maximus nec. Morbi ac magna lorem. Quisque suscipit quis nisi interdum condimentum. Pellentesque imperdiet lorem diam, eu molestie ipsum scelerisque vel. Vivamus hendrerit, ipsum id sollicitudin pharetra, justo justo laoreet lorem, ac scelerisque turpis justo vitae augue. Nullam lacinia magna nec neque auctor scelerisque. Nunc sit amet lacus condimentum, interdum nisl eu, pharetra lorem. Morbi consectetur eros ac nisi facilisis, facilisis placerat magna aliquet. Donec bibendum leo ac est aliquam dictum. Quisque commodo magna risus, ut rhoncus ex feugiat nec. Sed vel tellus porta, feugiat sem quis, facilisis enim. Quisque accumsan imperdiet felis id laoreet. Etiam condimentum at ligula nec vehicula. Phasellus eget placerat quam. Cras efficitur mauris id ex tempus porttitor. Quisque pulvinar tellus id tempus ultricies. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In non erat justo. Nulla blandit placerat hendrerit. Sed blandit mattis magna eget sodales. Morbi eget accumsan sapien. Sed ornare interdum tortor iaculis volutpat. Maecenas vel tortor quis urna placerat mollis. Mauris ultrices, magna sit amet molestie sagittis, libero mi tincidunt diam, eu scelerisque nulla est vel dolor. Aenean congue congue eros bibendum elementum. Phasellus lobortis faucibus eros, et cursus lectus ultricies et. Vivamus augue metus, iaculis eget egestas in, tincidunt et lectus. Mauris varius arcu at cursus auctor. Curabitur eget nunc tellus. In eget tempor odio, vitae dictum massa. Proin in cursus est. Curabitur lobortis, velit eu accumsan sollicitudin, orci orci aliquam velit, ac iaculis massa justo sit amet massa. Duis a mauris iaculis, aliquam ipsum vel, vulputate mauris. Sed ex augue, cursus a dapibus sed, iaculis lacinia quam. Vivamus sit amet justo tellus. Nunc ac neque mattis, euismod velit id, feugiat massa. Etiam vitae auctor orci. Pellentesque sollicitudin est nibh, vitae scelerisque lacus sagittis eu. Morbi convallis metus eu enim gravida, non finibus enim accumsan. In quis pharetra justo, et tempor nibh. Duis non interdum diam. Vestibulum nec felis rhoncus, pharetra ipsum eu, rutrum magna. Integer dignissim odio eu mi finibus sollicitudin. Sed ut magna a nulla porttitor lobortis in id nibh. Pellentesque in lobortis ligula, vel malesuada neque. Aenean commodo arcu nunc, et posuere eros vulputate et. Mauris vestibulum euismod molestie. Vestibulum luctus sapien sollicitudin, cursus ante vel, varius massa. Mauris non magna pharetra, luctus felis sed, dapibus massa. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec posuere sapien diam, vitae porttitor nisi dictum sed. Maecenas sit amet eleifend odio. In luctus, neque eget eleifend ultricies, neque ante vestibulum leo, non ullamcorper enim orci vestibulum erat. Phasellus bibendum urna at aliquet elementum. Nulla facilisi. Sed porttitor lacus id hendrerit iaculis. Vivamus facilisis ex eget odio malesuada bibendum. Vestibulum fermentum at sem nec dignissim. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nunc faucibus augue id odio ornare, et maximus quam placerat. Nullam rutrum enim justo, id hendrerit felis faucibus sed. Aenean id nulla arcu. Nulla vitae eleifend ante. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque ipsum risus, cursus at ligula convallis, interdum fringilla quam. Curabitur libero sapien, mollis in consectetur sit amet, accumsan vel justo. Nulla a eros sit amet nibh pharetra ultricies. Proin et dapibus mauris. Maecenas at lacinia felis. Vestibulum consectetur vestibulum ante. Interdum et malesuada fames ac ante ipsum primis in faucibus. In imperdiet ipsum ac facilisis interdum. Nullam vestibulum dictum vestibulum. Cras pharetra vehicula neque.'
    .split('.')
    .map(e => e.trim())
const generateSentence = () => {
  const pos = Math.floor(Math.random() * allSentencesArr.length)
  return allSentencesArr[pos]
}

const generateTitle = () => `<h1 style="
  font-family: var(--ff-marr-sans-condensed);
  font-weight: 800;
  font-size: calc(20px + 2.3vw);
  margin: 0;
  margin-bottom: 1vw;">
  ${generateSentence()}
</h1>`

const generateIntertitle = () => `<h2 style="
  font-family: var(--ff-marr-sans-condensed);
  font-weight: 700;
  font-size: calc(18px + 1.3vw);
  margin: 0;
  margin-bottom: 1vw;">
  ${generateSentence()}
</h2>`

const generateParagraph = () => {
  const length = Math.floor(Math.random() * 5) + 3
  const sentencesArr: string[] = new Array(length).fill(null).map(generateSentence)
  return `<p style="
    font-family: var(--ff-the-antiqua-b);
    font-weight: 400;
    font-size: 16px;
    margin: 0;
    margin-bottom: .8vw;">
    ${sentencesArr.join('. ')}
  </p>`
}
 
const generateContentPage = (len = 1) => {
  const length = (Math.floor(Math.random() * 3) + 3) * Math.round(len)
  return `<div style="padding: 40px; background-color: white;">
    ${generateTitle()}
    ${new Array(length).fill(null).map(() => {
      if (Math.random() < .2) return generateIntertitle()
      return generateParagraph()
    }).join('')}
    ${generateParagraph()}
  </div>`
}

const generateSimpleHTMLModule = () => `<div style="
  background-color: ${generateNiceColor()};
  padding: 24px;
  margin: 24px;">
  ${generateParagraph()}
  ${generateParagraph()}
</div>`

const generateAutoplayVideoModule = () => `<video muted autoplay playsinline loop>
  <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm" type="video/webm">
</video>`

interface Props extends InjectedProps {}
interface State {}


/* SCROLLGNGN SETTINGS */
const thresholdOffset = '20%'
const bgColorTransitionDuration = '600ms'
const pagesData: PageData[] = []
// const pagesData: PageData[] = [{
//   bgColor: generateNiceColor(),
//   blocks: [{
//     depth: 'scroll',
//     type: 'html',
//     content: generateContentPage(4),
//     layout: 'left-half',
//     mobileLayout: 'right-half'
//   }, {
//     id: 'mon-module',
//     depth: 'back',
//     type: 'module',
//     layout: 'right-half',
//     content: 'http://localhost:3003/index.js',
//     transitions: [
//       ['slide-up', 600],
//       ['fade', 300]
//     ],
//     trackScroll: true
//   }]
// }, {
//   bgColor: generateNiceColor(),
//   blocks: [{
//     depth: 'scroll',
//     type: 'html',
//     content: generateContentPage(4),
//     layout: 'left-half',
//     mobileLayout: 'right-half'
//   }, {
//     id: 'mon-module'
//   }]
// }, {
//   bgColor: generateNiceColor(),
//   blocks: [{
//     depth: 'scroll',
//     type: 'html',
//     content: generateContentPage(4),
//     layout: 'left-half',
//     mobileLayout: 'right-half'
//   }]
// }]
// const pagesData: PageData[] = [{
//   bgColor: generateNiceColor(),
//   blocks: [{
//     depth: 'scroll',
//     type: 'html',
//     content: generateContentPage(4),
//     layout: 'left-half',
//     mobileLayout: 'right-half'
//   }, {
//     depth: 'front',
//     zIndex: 1000,
//     type: 'html',
//     content: `<div style="width: 100%; height: 100vh;">${generateAutoplayVideoModule()}</div>`,
//     transitions: [
//       ['fade', 600],
//       ['slide-up', 2000]
//     ], 
//     mobileTransitions: [
//       ['grow', 600]
//     ]
//   }, {
//     depth: 'front',
//     type: 'html',
//     content: `<div style="width: 100%; height: 100vh;">${generateAutoplayVideoModule()}</div>`,
//     layout: 'right-half',
//     transitions: [
//       ['fade', 600],
//       ['whirl', 2000]
//     ], 
//     mobileTransitions: [
//       ['grow', 600]
//     ]
//   }]
// }, {
//   bgColor: generateNiceColor(),
//   blocks: [{
//     depth: 'scroll',
//     type: 'html',
//     content: generateContentPage(4),
//     layout: 'left-half',
//     mobileLayout: 'right-half'
//   }, {
//     id: 'ma-video',
//     depth: 'front',
//     type: 'html',
//     layout: 'right-half',
//     content: generateAutoplayVideoModule()
//   }]
// }, {
//   bgColor: generateNiceColor(),
//   blocks: [{
//     depth: 'scroll',
//     type: 'html',
//     content: generateContentPage(4),
//     layout: 'left-half',
//     mobileLayout: 'right-half'
//   }, {
//     id: 'ma-video'
//   }]
// }, {
//   bgColor: generateNiceColor(),
//   blocks: [{
//     depth: 'scroll',
//     type: 'html',
//     content: generateContentPage(4),
//     layout: 'left-half',
//     mobileLayout: 'right-half'
//   }, {
//     id: 'module',
//     depth: 'front',
//     type: 'module',
//     content: 'http://localhost:3003/index.js',
//     layout: 'right-half',
//     trackScroll: true
//   }]
// }, {
//   bgColor: generateNiceColor(),
//   blocks: [{
//     depth: 'scroll',
//     type: 'html',
//     content: generateContentPage(4),
//     layout: 'left-half',
//     mobileLayout: 'right-half'
//   }, {
//     id: 'module'
//   }]
// }]

class Longform extends Component<Props, State> {
  static clss: string = 'sable-longform'
  clss = Longform.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  /**
   * Renders the Longform
   * @returns {string}
   */
  render (): JSX.Element {
    const { props } = this

    // Assign classes and styles
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    // Display
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      <div style={{ height: '600px' }}>BEFORE SCRLGNGN</div>
      <Scrollgneugneu
        pages={pagesData}
        thresholdOffset={thresholdOffset}
        bgColorTransitionDuration={bgColorTransitionDuration} />
      <div style={{ height: '600px' }}>AFTER SCRLGNGN</div>
    </div>
  }
}

export type { Props, Longform }
export default appWrapper(Longform)
