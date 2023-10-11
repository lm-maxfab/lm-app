import { render, ComponentClass } from 'preact'
import { SheetBase } from '../../../modules/utils/sheet-base'

export interface AppNodeMap {
  app: ComponentClass<{ sheetBase?: SheetBase }>
  selector: string
}

const renderedNodes: Node[] = []

export default function renderLMApp  (renderList: AppNodeMap[], sheetBase?: SheetBase): JSX.Element[] {
  let attempts = 0
  window.setInterval(() => {
    if (attempts > 5) return;
    attempts += 1
    renderApps(renderList, sheetBase)
  }, 100)
  return renderApps(renderList, sheetBase)
}

function renderApps (renderList: AppNodeMap[], sheetBase?: SheetBase): JSX.Element[] {
  const rendered: JSX.Element[] = []
  renderList.forEach(({ app: App, selector }) => {
    const nodes = document.querySelectorAll(selector)
    const app = <App sheetBase={sheetBase} />
    rendered.push(app)
    nodes.forEach(node => {
      if (renderedNodes.includes(node)) return;
      render(app, node)
      renderedNodes.push(node)
    })
  })
  return rendered
}
