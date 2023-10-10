function getPageId (): string|null {
  const idNode = document.querySelector('.lm-app-id')
  if (idNode === null) return null
  const id = idNode.innerHTML
  return id
}

export default getPageId
