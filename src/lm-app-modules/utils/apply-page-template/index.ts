export default async function applyPageTemplate (template: string) {
  if (window.location.hostname !== 'localhost') return console.warn('Using this utility is only allowed from localhost.')
  try {
    const templateResponse = await window.fetch(`http://localhost:3001/utils/le-monde-page-templates/${template}/index.html`)
    if (!templateResponse.ok) throw new Error(`Page template '${template}' was not found.`)
    const templateHTMLString = await templateResponse.text()

    const $templateDocument = document.implementation.createHTMLDocument()
    $templateDocument.write(templateHTMLString)
    const $templateHtml = $templateDocument.querySelector('html') ?? document.createElement('HTML')

    const $templateHeadPlaceholder = $templateHtml.querySelector('.lm-app-head-placeholder')
    const $templateConfigPlaceholder = $templateHtml.querySelector('.lm-app-config-placeholder')
    const $templateScriptsPlaceholder = $templateHtml.querySelector('.lm-app-scripts-placeholder')

    const $html = document.querySelector('html')
    const $head = $html?.querySelector('head')
    const $body = $html?.querySelector('body')
    const $config = $body?.querySelector('.lm-app-config')
    const $script = $body?.querySelector('.lm-app-script')

    const headChildren = [...($head?.children ?? [])]
    headChildren.forEach(headChild => $templateHeadPlaceholder?.parentNode?.insertBefore(headChild, $templateHeadPlaceholder))    
    $templateConfigPlaceholder?.insertAdjacentHTML('afterend', $config?.outerHTML ?? '')
    $templateScriptsPlaceholder?.insertAdjacentHTML('afterend', $script?.outerHTML ?? '')

    $templateHeadPlaceholder?.remove()
    $templateConfigPlaceholder?.remove()
    $templateScriptsPlaceholder?.remove()

    if ($html !== null) {
      $html.innerHTML = $templateHtml.innerHTML
      for (const attr of $templateHtml.attributes) $html.setAttribute(attr.name, attr.value)
    }
  } catch (err) {
    console.warn(err)
  }
}
