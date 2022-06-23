import TritonLongform from './TritonLongform'
import TritonFooter from './TritonFooter'
import { AppNodeMap } from '../modules/utils/render-app'

const appsNodes: AppNodeMap[] = [
  { app: TritonLongform, selector: '.triton-scrollator-root' },
  { app: TritonFooter, selector: '.triton-footer-root' }
]

export default appsNodes
