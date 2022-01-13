export default function getHeaderElement (): HTMLElement|undefined {
  const mobileHeaderSelector = '#Header .Header.Header--no-expanded .wrapper'
  const desktopHeaderSelector = '#nav-desktop'
  const possibleNavs = Array.from(
    document.querySelectorAll([
      mobileHeaderSelector,
      desktopHeaderSelector
    ].join(', '))
  ) as HTMLElement[]
  if (possibleNavs.length === 0) return
  possibleNavs.sort((navA, navB) => {
    const heightA = navA.getBoundingClientRect().height
    const heightB = navB.getBoundingClientRect().height
    return heightB - heightA
  })
  return possibleNavs[0]
}
