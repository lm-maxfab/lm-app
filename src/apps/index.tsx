import Cover from './Cover'
import Snippet from './Snippet'
import Snippet2 from './Snippet2'
import { AppNodeMap } from '../modules/utils/render-app'

const appsNodes: AppNodeMap[] = [
  { app: Cover, selector: '.syrie-cover-root' },
  { app: Snippet, selector: '.syrie-snippet-root' },
  { app: Snippet2, selector: '.syrie-snippet-2-root' }
]

export default appsNodes
