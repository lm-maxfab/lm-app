import { ConfigLayout } from '../get-config'

export default function applyPageLayout(layout: ConfigLayout) {
  if (window.location.hostname !== 'localhost') return console.warn('Using this utility is only allowed from localhost.')
  const $coversPlaceholder = document.querySelector('.lm-app-covers-placeholder')
  const $snippetsPlaceholder = document.querySelector('.lm-app-snippets-placeholder')
  const $longformsPlaceholder = document.querySelector('.lm-app-longforms-placeholder')
  layout.nodes.forEach(nodeData => {
    const node = document.createElement('DIV')
    node.setAttribute('class', `lm-app-root lm-app-root_${nodeData.type} ${nodeData.class}`)
    if (nodeData.type === 'cover') {
      const wrapper = document.createElement('DIV')
      wrapper.setAttribute('class', 'multimedia-embed hero-container')
      wrapper.innerHTML = node.outerHTML
      $coversPlaceholder?.parentNode?.insertBefore(wrapper, $coversPlaceholder)
    } else if (nodeData.type === 'snippet') {
      const wrapper = document.createElement('DIV')
      wrapper.setAttribute('class', 'snippet-container multimedia-embed snippet-medium snippet-right')
      wrapper.innerHTML = node.outerHTML
      $snippetsPlaceholder?.parentNode?.insertBefore(wrapper, $snippetsPlaceholder)
    } else if (nodeData.type === 'longform') {
      $longformsPlaceholder?.parentNode?.insertBefore(node, $longformsPlaceholder)
    }
  })
  $coversPlaceholder?.remove()
  $snippetsPlaceholder?.remove()
  $longformsPlaceholder?.remove()
}
