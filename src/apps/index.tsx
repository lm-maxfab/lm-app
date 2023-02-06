import { AppNodeMap } from '../modules/utils/render-app'
import LongformOf from './Longform'
import Footer from './Footer'

const appsNodes: AppNodeMap[] = [
  { app: Footer, selector: '.hydra-footer' },
  { app: LongformOf('visuel-interactif'), selector: '.hydra-visuel-interactif' },
  { app: LongformOf('cover-article-1'), selector: '.hydra-cover-article-1' },
  { app: LongformOf('cover-article-2'), selector: '.hydra-cover-article-2' },
  { app: LongformOf('cover-article-3'), selector: '.hydra-cover-article-3' },
  { app: LongformOf('cover-article-4'), selector: '.hydra-cover-article-4' },
  { app: LongformOf('cover-article-5'), selector: '.hydra-cover-article-5' },
  { app: LongformOf('cover-article-6'), selector: '.hydra-cover-article-6' },
  { app: LongformOf('cover-article-7'), selector: '.hydra-cover-article-7' },
  { app: LongformOf('cover-article-8'), selector: '.hydra-cover-article-8' },
  { app: LongformOf('cover-article-9'), selector: '.hydra-cover-article-9' },
  { app: LongformOf('cover-article-10'), selector: '.hydra-cover-article-10' }
]

export default appsNodes
