import { render, ComponentClass } from 'preact'
import { SheetBase } from '../../../modules/utils/sheet-base'

export interface AppNodeMap {
  app: ComponentClass<{ sheetBase?: SheetBase }>
  selector: string
}

export default function renderLMApp (renderList: AppNodeMap[], sheetBase?: SheetBase): JSX.Element[] {
  const rendered: JSX.Element[] = []
  renderList.forEach(({ app: App, selector }) => {
    const nodes = document.querySelectorAll(selector)
    const app = <App sheetBase={sheetBase} />
    rendered.push(app)
    nodes.forEach(node => render(app, node))
  })
  return rendered
}
