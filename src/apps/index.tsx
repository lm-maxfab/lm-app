import Cover from './Cover'
import Snippet from './Snippet'
import { AppNodeMap } from '../modules/utils/render-app'

const appsNodes: AppNodeMap[] = [
  { app: Cover, selector: '.syrie-cover-root' },
  { app: Snippet, selector: '.syrie-snippet-root' }
]

export default appsNodes
