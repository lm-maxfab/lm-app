import Longform from './Longform'
import Header from './Header'
import Footer from './Footer'
import { AppNodeMap } from '../modules/utils/render-app'

const appsNodes: AppNodeMap[] = [
  { app: Longform, selector: '.sable-longform-root' },
  { app: Header, selector: '.sable-header-root' },
  { app: Footer, selector: '.sable-footer-root' }
]

export default appsNodes
