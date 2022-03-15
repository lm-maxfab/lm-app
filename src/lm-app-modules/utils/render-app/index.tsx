import { render, ComponentClass } from 'preact'
import { SheetBase } from '../../../modules/utils/sheet-base'

interface AppNodeMap {
  app: ComponentClass<{ sheetBase?: SheetBase }>
  selector: string
}

function renderLMApp (renderList: AppNodeMap[], sheetBase?: SheetBase): void {
  renderList.forEach(({ app: App, selector }) => {
    const nodes = document.querySelectorAll(selector)
    const app = <App sheetBase={sheetBase} />
    nodes.forEach(node => render(app, node))
  })
}

export type { AppNodeMap }
export default renderLMApp
