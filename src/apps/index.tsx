import { AppNodeMap } from '../modules/utils/render-app'
import LongformOf from './Longform'
import Footer from './Footer'

const appsNodes: AppNodeMap[] = [
  { app: Footer, selector: '.outoc-footer' },
  { app: LongformOf('cover-article-1'), selector: '.outoc-cover-article-1' },
  { app: LongformOf('cover-article-2'), selector: '.outoc-cover-article-2' },
  { app: LongformOf('cover-article-3'), selector: '.outoc-cover-article-3' },
  { app: LongformOf('cover-article-4'), selector: '.outoc-cover-article-4' },
  { app: LongformOf('cover-article-5'), selector: '.outoc-cover-article-5' },
  { app: LongformOf('cover-article-6'), selector: '.outoc-cover-article-6' },
  { app: LongformOf('cover-article-7'), selector: '.outoc-cover-article-7' },
  { app: LongformOf('cover-article-8'), selector: '.outoc-cover-article-8' },
  { app: LongformOf('cover-article-9'), selector: '.outoc-cover-article-9' },
  { app: LongformOf('cover-article-10'), selector: '.outoc-cover-article-10' }
]

export default appsNodes
