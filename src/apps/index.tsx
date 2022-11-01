import { AppNodeMap } from '../modules/utils/render-app'
import Longform from './Longform'
import Header from './Header'
import Cover from './Cover'
import Footer from './Footer'

const appsNodes: AppNodeMap[] = [
  { app: Longform, selector: '.mondial-longform-root' },
  { app: Header, selector: '.mondial-header-root' },
  { app: Cover, selector: '.mondial-cover-root' },
  { app: Footer, selector: '.mondial-footer-root' },
]

export default appsNodes
