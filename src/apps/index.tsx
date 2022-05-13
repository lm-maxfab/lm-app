import Art1Cover from './Art1Cover'
import Art1Snip1 from './Art1Snip1'
import Art1Snip2 from './Art1Snip2'
import Art2Cover from './Art2Cover'
import { AppNodeMap } from '../modules/utils/render-app'

const appsNodes: AppNodeMap[] = [
  { app: Art1Cover, selector: '.xjg-files-art-1-cover-root' },
  { app: Art1Snip1, selector: '.xjg-files-art-1-snip-1-root' },
  { app: Art1Snip2, selector: '.xjg-files-art-1-snip-2-root' },
  { app: Art2Cover, selector: '.xjg-files-art-2-cover-root' }
]

export default appsNodes
