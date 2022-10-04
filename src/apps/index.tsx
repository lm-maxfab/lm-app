import { AppNodeMap } from '../modules/utils/render-app'
import Longform from './Longform'
import SideNote from './SideNote'

const appsNodes: AppNodeMap[] = [
  { app: Longform, selector: '.metoo-longform-root' },
  { app: SideNote, selector: '.metoo-side-note-root' }
]

export default appsNodes
