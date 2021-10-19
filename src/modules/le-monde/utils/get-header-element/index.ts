export default function getHeaderElement (): HTMLElement|undefined {
  const longformHeaderSelector = '.multimediaNav'
  const articleHeaderSelector = '#Header'
  const possibleNavs = Array.from(
    document.querySelectorAll(`${longformHeaderSelector}, ${articleHeaderSelector}`)
  ) as HTMLElement[]
  if (possibleNavs.length === 0) return
  possibleNavs.sort((navA, navB) => {
    const heightA = navA.getBoundingClientRect().height
    const heightB = navB.getBoundingClientRect().height
    return heightB - heightA
  })
  return possibleNavs[0]
}