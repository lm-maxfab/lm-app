import { AppNodeMap } from '../modules/utils/render-app'
import LongformOf from './Longform'

const appsNodes: AppNodeMap[] = [
  { app: LongformOf('cover'), selector: '.iran-cover-slot' },
  { app: LongformOf('slot-1'), selector: '.iran-article-slot-1' },
  { app: LongformOf('slot-2'), selector: '.iran-article-slot-2' },
  { app: LongformOf('slot-3'), selector: '.iran-article-slot-3' },
  { app: LongformOf('slot-4'), selector: '.iran-article-slot-4' },
  { app: LongformOf('slot-5'), selector: '.iran-article-slot-5' }
]

export default appsNodes
