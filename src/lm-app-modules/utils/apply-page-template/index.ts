export default async function applyPageTemplate (template: string) {
  if (window.location.hostname !== 'localhost') return console.warn('Using this utility is only allowed from localhost.')
  try {
    const templateResponse = await window.fetch(`http://localhost:3001/utils/le-monde-page-templates/${template}.html`)
    if (!templateResponse.ok) throw new Error(`Page template '${template}' was not found.`)
    const templateHTMLString = await templateResponse.text()
    const $templateHtml = document.createElement('HTML')
    $templateHtml.innerHTML = templateHTMLString

    const $headPlaceholder = $templateHtml.querySelector('.lm-app-head-placeholder')
    const $configPlaceholder = $templateHtml.querySelector('.lm-app-config-placeholder')
    const $scriptsPlaceholder = $templateHtml.querySelector('.lm-app-scripts-placeholder')

    const $html = document.querySelector('html')
    const $head = $html?.querySelector('head')
    const $body = $html?.querySelector('body')
    const $config = $body?.querySelector('.lm-app-config')
    const $script = $body?.querySelector('.lm-app-script')

    const headChildren = [...($head?.children ?? [])]
    headChildren.forEach(headChild => $headPlaceholder?.parentNode?.insertBefore(headChild, $headPlaceholder))    
    $configPlaceholder?.insertAdjacentHTML('afterend', $config?.outerHTML ?? '')
    $scriptsPlaceholder?.insertAdjacentHTML('afterend', $script?.outerHTML ?? '')

    $headPlaceholder?.remove()
    $configPlaceholder?.remove()
    $scriptsPlaceholder?.remove()

    if ($html !== null) $html.innerHTML = $templateHtml.innerHTML
  } catch (err) {
    console.warn(err)
  }
}
