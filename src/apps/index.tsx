import { AppNodeMap } from '../modules/utils/render-app'
import Longform from './Longform'
import Footer from './Footer'

const appsNodes: AppNodeMap[] = [
  { app: Longform, selector: '.ia-longform-root' },
  { app: Footer, selector: '.ia-footer-root' }
]

export default appsNodes
