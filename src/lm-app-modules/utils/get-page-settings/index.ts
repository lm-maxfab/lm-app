interface PageSettings {
  layout: string|null
  template: string|null
  env: string|null
}

function getPageSettings (): PageSettings|undefined {
  if (window.location.hostname !== 'localhost') return
  const params = new window.URLSearchParams(window.location.search)
  const layout = params.get('layout')
  const template = params.get('template')
  const env = params.get('env')
  return { layout, template, env }
}

export default getPageSettings
export type { PageSettings }
