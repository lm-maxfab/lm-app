import { AppNodeMap } from '../modules/utils/render-app'
import LongformOf from './Longform'
import Sidenote from './Sidenote'
import Footer from './Footer'

const appsNodes: AppNodeMap[] = [
  { app: Footer, selector: '.pedocrim-footer' },
  { app: Sidenote, selector: '.pedocrim-sidenote' },
  { app: LongformOf('messages-snippet'), selector: '.pedocrim-messages' },
  { app: LongformOf('cover-article-1'), selector: '.pedocrim-cover-article-1' },
  { app: LongformOf('cover-article-2'), selector: '.pedocrim-cover-article-2' },
  { app: LongformOf('cover-article-3'), selector: '.pedocrim-cover-article-3' },
  { app: LongformOf('cover-article-4'), selector: '.pedocrim-cover-article-4' },
  { app: LongformOf('cover-article-5'), selector: '.pedocrim-cover-article-5' },
  { app: LongformOf('cover-article-6'), selector: '.pedocrim-cover-article-6' },
  { app: LongformOf('cover-article-7'), selector: '.pedocrim-cover-article-7' },
  { app: LongformOf('cover-article-8'), selector: '.pedocrim-cover-article-8' },
  { app: LongformOf('cover-article-9'), selector: '.pedocrim-cover-article-9' },
  { app: LongformOf('cover-article-10'), selector: '.pedocrim-cover-article-10' }
]

export default appsNodes
