import { AppNodeMap } from '../modules/utils/render-app'
import LongformOf from './Longform'
import Sidenote from './Sidenote'
import Footer from './Footer'

const appsNodes: AppNodeMap[] = [
  { app: Footer, selector: '.pfas-footer' },
  { app: Sidenote, selector: '.pfas-sidenote' },
  { app: LongformOf('cover-article-1'), selector: '.pfas-cover-article-1' },
  { app: LongformOf('cover-article-2'), selector: '.pfas-cover-article-2' },
  { app: LongformOf('cover-article-3'), selector: '.pfas-cover-article-3' },
  { app: LongformOf('cover-article-4'), selector: '.pfas-cover-article-4' },
  { app: LongformOf('cover-article-5'), selector: '.pfas-cover-article-5' },
  { app: LongformOf('cover-article-6'), selector: '.pfas-cover-article-6' },
  { app: LongformOf('cover-article-7'), selector: '.pfas-cover-article-7' },
  { app: LongformOf('cover-article-8'), selector: '.pfas-cover-article-8' },
  { app: LongformOf('cover-article-9'), selector: '.pfas-cover-article-9' },
  { app: LongformOf('cover-article-10'), selector: '.pfas-cover-article-10' }
]

export default appsNodes
