import Longform from './Longform'

interface RenderedAppAndNode {
  app: typeof Longform,
  rootNodeClass: string
}

const rendered: RenderedAppAndNode[] = [
  { app: Longform, rootNodeClass: 'lm-app-root-longform' }
]

export default rendered
